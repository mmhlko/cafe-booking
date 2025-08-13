export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const apiEndPoint = '/api'

export const apiRoutes = {
	health: 'api/health',
	table: {
		serverRoute: 'table',
		baseRoute: 'api/table',
	},
  analytics: {
    serverRoute: 'analytics',
		baseRoute: 'api/analytics',
  }
}
