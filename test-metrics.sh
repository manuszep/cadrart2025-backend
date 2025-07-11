#!/bin/bash

# Test script to verify Cadrart Prometheus metrics
# Make sure the backend is running and METRICS_API_KEY is set

echo "Testing Cadrart Prometheus metrics endpoint..."

# Check if METRICS_API_KEY is set
if [ -z "$METRICS_API_KEY" ]; then
    echo "Error: METRICS_API_KEY environment variable is not set"
    echo "Please set it to your metrics API key"
    exit 1
fi

# Test the metrics endpoint
echo "Fetching metrics from /api/metrics/prometheus..."
curl -H "Authorization: Bearer $METRICS_API_KEY" \
     -H "Content-Type: text/plain" \
     http://localhost:3000/api/metrics/prometheus

echo ""
echo ""
echo "Checking for cadrart_ prefixed metrics..."

# Check if cadrart_ prefixed metrics are present
curl -s -H "Authorization: Bearer $METRICS_API_KEY" \
     http://localhost:3000/api/metrics/prometheus | grep -E "^cadrart_" | head -10

echo ""
echo "Metrics test completed!"
