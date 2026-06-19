export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/admin/((?!login).*)", 
    "/dashboard/:path*", 
    "/book/:path*",
    "/rider/:path*",
    "/vendor/:path*"
  ] 
}
