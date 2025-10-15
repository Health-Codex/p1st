#!/bin/zsh
# Download Open Sans font files for local use in the replica
# Creates the fonts directory if it doesn't exist

FONTDIR="wp-content/themes/u-design/assets/css/frontend/global/fonts"
mkdir -p "$FONTDIR"

# Download Regular
curl -L -o "$FONTDIR/OpenSans-Regular.woff2" "https://fonts.gstatic.com/s/opensans/v34/mem8YaGs126MiZpBA-UFVZ0e.woff2"
curl -L -o "$FONTDIR/OpenSans-Regular.woff" "https://fonts.gstatic.com/s/opensans/v34/mem8YaGs126MiZpBA-UFVZ0e.woff"

# Download SemiBold
curl -L -o "$FONTDIR/OpenSans-SemiBold.woff2" "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UNirkOX-hpOqc.woff2"
curl -L -o "$FONTDIR/OpenSans-SemiBold.woff" "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UNirkOX-hpOqc.woff"

# Download Bold
curl -L -o "$FONTDIR/OpenSans-Bold.woff2" "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UN7rgOX-hpOqc.woff2"
curl -L -o "$FONTDIR/OpenSans-Bold.woff" "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UN7rgOX-hpOqc.woff"

echo "Open Sans font files downloaded to $FONTDIR."
