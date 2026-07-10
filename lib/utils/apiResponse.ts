export function successResponse(data: any, message = 'Success', status = 200) {
  return Response.json({ success: true, message, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ success: false, message }, { status })
}