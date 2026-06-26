import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await prisma.enterpriseClient.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!client) {
    return NextResponse.json({ error: 'Enterprise client not found' }, { status: 404 })
  }

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1)

  const [currentMonthOrders, lastMonthOrders, allTimeDeliveries] = await Promise.all([
    prisma.order.findMany({
      where: {
        enterpriseClientId: client.id,
        status: 'DELIVERED',
        createdAt: { gte: currentMonthStart },
      },
      select: {
        id: true,
        errandDescription: true,
        totalAmount: true,
        createdAt: true,
        dropoffLocation: true,
      },
    }),
    prisma.order.findMany({
      where: {
        enterpriseClientId: client.id,
        status: 'DELIVERED',
        createdAt: { gte: lastMonthStart, lt: lastMonthEnd },
      },
      select: {
        id: true,
        errandDescription: true,
        totalAmount: true,
        createdAt: true,
        dropoffLocation: true,
      },
    }),
    prisma.order.count({
      where: {
        enterpriseClientId: client.id,
        status: 'DELIVERED',
      },
    }),
  ])

  const currentMonthDeliveries = currentMonthOrders.length
  const lastMonthDeliveries = lastMonthOrders.length

  return NextResponse.json({
    rate: client.rate,
    currentMonth: {
      deliveries: currentMonthDeliveries,
      amount: currentMonthDeliveries * client.rate,
      orders: currentMonthOrders,
    },
    lastMonth: {
      deliveries: lastMonthDeliveries,
      amount: lastMonthDeliveries * client.rate,
      orders: lastMonthOrders,
    },
    allTimeDeliveries,
    allTimeAmount: allTimeDeliveries * client.rate,
  })
}
