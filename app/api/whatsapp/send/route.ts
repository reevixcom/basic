
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const { to, message } = await request.json()

		const token = process.env.WHATSAPP_ACCESS_TOKEN
		const phoneNumberId =
			process.env.WHATSAPP_PHONE_NUMBER_ID

		if (!token || !phoneNumberId) {
			return NextResponse.json(
				{ error: "Missing WhatsApp environment variables" },
				{ status: 500 }
			)
		}

		if (
			typeof to !== "string" ||
			typeof message !== "string" ||
			!to.trim() ||
			!message.trim()
		) {
			return NextResponse.json(
				{ error: "Recipient number and message are required" },
				{ status: 400 }
			)
		}

		const response = await fetch(
			`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messaging_product: "whatsapp",
					recipient_type: "individual",
					to: to.replace(/\D/g, ""),
					type: "text",
					text: { body: message },
				}),
			}
		)

		const data = await response.json()

		if (!response.ok) {
			console.error("WhatsApp API error:", data)
			return NextResponse.json(
				{ error: data },
				{ status: response.status }
			)
		}

		return NextResponse.json({
			success: true,
			data,
		})
	} catch (error) {
		console.error("Send error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
