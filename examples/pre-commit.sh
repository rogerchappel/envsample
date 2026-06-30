#!/usr/bin/env bash
set -euo pipefail

target="${1:-.}"
example="${2:-.env.example}"

npx envsample validate "$target" --example "$example"
