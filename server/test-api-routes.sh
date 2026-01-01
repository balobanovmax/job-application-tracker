#!/bin/bash

BASE_URL="http://localhost:3001"
API_URL="$BASE_URL/api/applications"

echo "Testing Job Application API Routes"
echo "======================================"
echo ""

sleep 3

echo "1. POST /api/applications - Create Application #1 (Apple)"
APP1=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Apple",
    "role": "Software Engineer",
    "status": "applied",
    "date_applied": "2025-01-15"
  }')

APP1_ID=$(echo $APP1 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Response: $APP1"
echo "Created ID: $APP1_ID"
echo ""

echo "2. POST /api/applications - Create Application #2 (Google)"
APP2=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "role": "Frontend Developer",
    "status": "interview",
    "date_applied": "2025-01-10"
  }')

APP2_ID=$(echo $APP2 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Response: $APP2"
echo "Created ID: $APP2_ID"
echo ""

echo "3. POST /api/applications - Create Application #3 (Microsoft)"
APP3=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Microsoft",
    "role": "Backend Engineer",
    "status": "rejected",
    "date_applied": "2025-01-01"
  }')

APP3_ID=$(echo $APP3 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Response: $APP3"
echo ""

echo "4. GET /api/applications - Get All Applications"
curl -s "$API_URL" | python3 -m json.tool
echo ""

echo "5. GET /api/applications/:id - Get Single Application"
curl -s "$API_URL/$APP1_ID" | python3 -m json.tool
echo ""

echo "6. GET /api/applications?status=interview - Filter by Status"
curl -s "$API_URL?status=interview" | python3 -m json.tool
echo ""

echo "7. GET /api/applications?company=Apple - Filter by Company"
curl -s "$API_URL?company=Apple" | python3 -m json.tool
echo ""

echo "8. GET /api/applications?date_applied=2025-01-01 - Filter by Date"
curl -s "$API_URL?date_applied=2025-01-01" | python3 -m json.tool
echo ""

echo "9. PATCH /api/applications/:id - Update Application"
curl -s -X PATCH "$API_URL/$APP1_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "offer",
    "role": "Senior Software Engineer"
  }' | python3 -m json.tool
echo ""

echo "10. GET /api/applications/:id - Verify Update"
curl -s "$API_URL/$APP1_ID" | python3 -m json.tool
echo ""

echo "11. DELETE /api/applications/:id - Delete Single Application"
curl -s -X DELETE "$API_URL/$APP2_ID" | python3 -m json.tool
echo ""

echo "12. GET /api/applications - Verify Deletion"
curl -s "$API_URL" | python3 -m json.tool
echo ""

echo "13. DELETE /api/applications - Delete All Applications"
curl -s -X DELETE "$API_URL" | python3 -m json.tool
echo ""

echo "14. GET /api/applications - Verify All Deleted"
curl -s "$API_URL" | python3 -m json.tool
echo ""

echo "15. POST /api/applications - Test Validation (Missing Fields)"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"company": "Amazon"}' | python3 -m json.tool
echo ""

echo "16. POST /api/applications - Test Validation (Invalid Status)"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Netflix",
    "role": "DevOps",
    "status": "invalid_status"
  }' | python3 -m json.tool
echo ""

echo "======================================"
echo "All API route tests completed!"

