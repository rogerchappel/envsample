#!/usr/bin/env bash
set -euo pipefail

curl "$PUBLIC_API_BASE/health?token=\${WORKER_TOKEN}"
