#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

srcDir="$scriptDir/.."
opencodeDir="$HOME/.config/opencode"
mkdir -p $opencodeDir
rsync -avhH --delete $srcDir"/skills/taski-add/" $opencodeDir"/commands/taski-add/"
rsync -avhH --delete $srcDir"/skills/taski-add/" $opencodeDir"/skills/taski-add/"
