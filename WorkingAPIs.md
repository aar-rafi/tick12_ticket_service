# API Endpoints Documentation

### Book Ticket

- **Endpoint**: `http://localhost:8000/api/ticket/book`
- **Method**: `POST`

#### Request Body

```json
{
  "from_station_name": "Dhaka",
  "to_station_name": "Khulna",
  "train_id": "01827216261",
  "user_id": "01827216261",
  "seat_numbers": [10, 20, 30]
}
```

#### Response
```json
{
    "message": "Tickets booked successfully",
    "tickets": [
        {
            "ticket_id": "0a57e453-79d7-48b6-a147-902053049e9c",
            "user_id": "6037e588-7da9-4422-8bfc-d780eb7d39e0",
            "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
            "seat_number": "10",
            "price": "200.00",
            "status": 1
        },
        {
            "ticket_id": "f325c758-f4ac-45f3-9b4b-ec03d40743c4",
            "user_id": "6037e588-7da9-4422-8bfc-d780eb7d39e0",
            "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
            "seat_number": "20",
            "price": "200.00",
            "status": 1
        },
        {
            "ticket_id": "1bf76e8e-fd3a-4ddb-b88d-248480ec62b1",
            "user_id": "6037e588-7da9-4422-8bfc-d780eb7d39e0",
            "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
            "seat_number": "30",
            "price": "200.00",
            "status": 1
        }
    ]
}
```