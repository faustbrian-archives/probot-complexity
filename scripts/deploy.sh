#!/bin/sh
now="npx now --debug --token=$NOW_TOKEN"

echo "$ now rm --safe --yes complexity"
$now rm --safe --yes complexity

echo "$ now --public"
$now --public

echo "$ now alias"
$now alias
