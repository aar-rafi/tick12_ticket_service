# API Documentation

### Book Ticket
**Endpoint:**  
`https://district12.xyz/ticket/api/ticket/book`

**Local Dev Endpoint:**  
`http://localhost:8001/api/ticket/book`

**Method:**  
`POST`

**Body:**
```json
{
  "from_station_name": "Dhaka",
  "to_station_name": "Khulna",
  "user_id": "user_id",
  "train_id": "train_id",
  "seat_numbers": ["A32", "A33", "A34", "A35"],
}
```

**Response:**

**Status Code: 201**
```json
{
  "message": "Tickets booked successfully",
  "tickets": "An array of ticket objects. For ticket object, ref to Database folder of main repo.",
}
```

**Tickets Not Found:**

**Status Code: 404**
```json
{
  "error": "Failed to book tickets",
}
```

**Error:**

**Status Code: 500**
```json
{
  "error": "error message",
}
```