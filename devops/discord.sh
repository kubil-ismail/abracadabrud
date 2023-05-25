#!/bin/bash

# URL webhook Discord
WEBHOOK_URL="https://discord.com/api/webhooks/1087363394761404546/tL_4u_PgKTM5l8vDUIWbFbXqGs_OoNR1qgl_A6cA1liG8umqUlQuG-8Mjo9QHKc9_t2k"

# Pesan default
MESSAGE="Deploy berhasil! jangan lupa cek: https://abracadabra-starquest.events"

# Cek parameter
if [[ $# -eq 1 ]]; then
    if [ "$1" == "development" ]; then
        URL="https://dev.fe.abracadabra-starquest.events"
        MESSAGE="Deploy berhasil! jangan lupa cek: https://dev.fe.abracadabra-starquest.events"
    elif [ "$1" == "staging" ]; then
        URL="https://staging.fe.abracadabra-starquest.events"
        MESSAGE="Deploy berhasil! jangan lupa cek: https://staging.fe.abracadabra-starquest.events"
    fi
fi

# Mengukur waktu respons menggunakan curl dan mengonversi ke milidetik (ms)
RESPONSE_TIME_SEC=$(curl -o /dev/null -s -w "%{time_total}" $URL)
RESPONSE_TIME_SEC=$(printf "%.1f" $RESPONSE_TIME_SEC)

# Format pesan menjadi JSON
PAYLOAD="{
    \"content\": \"Waktu Respons ke $1\nHTTP Status: 200\nWaktu Respons (second): $RESPONSE_TIME_SEC\n$MESSAGE\"
}"

# Kirim pesan menggunakan curl
curl -H "Content-Type: application/json" -d "$PAYLOAD" $WEBHOOK_URL