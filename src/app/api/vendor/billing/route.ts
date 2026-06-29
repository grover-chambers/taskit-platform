import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizedErrorResponse } from '@/lib/api-error'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
      include: { enterpriseClient: true },
    })

    if (!membership || !membership.enterpriseClient) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 })
    }

    const client = membership.enterpriseClient

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
    const currentMonthAmount = currentMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const lastMonthAmount = lastMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0)

    const allTimeResult = await prisma.order.aggregate({
      where: { enterpriseClientId: client.id, status: 'DELIVERED' },
      _sum: { totalAmount: true },
    })

    return NextResponse.json({
      enterpriseName: client.name,
      rate: client.rate,
      currentMonth: {
        deliveries: currentMonthDeliveries,
        amount: currentMonthAmount,
        orders: currentMonthOrders,
      },
      lastMonth: {
        deliveries: lastMonthDeliveries,
        amount: lastMonthAmount,
        orders: lastMonthOrders,
      },
      allTimeDeliveries,
      allTimeAmount: allTimeResult._sum.totalAmount || 0,
    })
  } catch (error: unknown) {
    return sanitizedErrorResponse(error)
  }
}
