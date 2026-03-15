#!/bin/bash

# Data Verify MCP Server - Quick Install Script

set -e

echo "🔍 Data Verify MCP Server - Quick Install"
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "   Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Select installation mode
echo "Select your AI client:"
echo "  1) Claude Code"
echo "  2) Cursor"
echo "  3) VSCode (Copilot Chat MCP)"
echo "  4) Claude Desktop"
echo "  5) Just show config (manual setup)"
echo ""
read -p "Enter choice [1-5]: " choice

PACKAGE_NAME="data-verify-mcp"

case $choice in
    1)
        echo ""
        echo "📦 Configuring for Claude Code..."
        if command -v claude &> /dev/null; then
            claude mcp add data-verify -- npx -y "$PACKAGE_NAME"
            echo "✅ MCP server added to Claude Code!"
            echo ""
            echo "💡 To add with access token:"
            echo "   claude mcp add data-verify -e DATA_VERIFY_ACCESS_TOKEN=your_token -- npx -y $PACKAGE_NAME"
        else
            echo "❌ Claude Code CLI not found. Install it first:"
            echo "   npm install -g @anthropic-ai/claude-code"
        fi
        ;;
    2)
        echo ""
        echo "📦 Configuring for Cursor..."
        CURSOR_DIR="$HOME/.cursor"
        CURSOR_CONFIG="$CURSOR_DIR/mcp.json"
        mkdir -p "$CURSOR_DIR"

        if [ -f "$CURSOR_CONFIG" ]; then
            echo "⚠️  Existing config found at $CURSOR_CONFIG"
            echo "   Please manually add the following to mcpServers:"
        else
            cat > "$CURSOR_CONFIG" << 'CURSOREOF'
{
  "mcpServers": {
    "data-verify": {
      "command": "npx",
      "args": ["-y", "data-verify-mcp"]
    }
  }
}
CURSOREOF
            echo "✅ Config written to $CURSOR_CONFIG"
        fi

        echo ""
        echo "📋 Cursor MCP config:"
        echo '  {'
        echo '    "mcpServers": {'
        echo '      "data-verify": {'
        echo '        "command": "npx",'
        echo '        "args": ["-y", "data-verify-mcp"]'
        echo '      }'
        echo '    }'
        echo '  }'
        ;;
    3)
        echo ""
        echo "📦 Configuring for VSCode..."
        VSCODE_DIR="$HOME/.vscode"
        VSCODE_CONFIG="$VSCODE_DIR/mcp.json"
        mkdir -p "$VSCODE_DIR"

        if [ -f "$VSCODE_CONFIG" ]; then
            echo "⚠️  Existing config found at $VSCODE_CONFIG"
            echo "   Please manually add the following to servers:"
        else
            cat > "$VSCODE_CONFIG" << 'VSCODEEOF'
{
  "servers": {
    "data-verify": {
      "command": "npx",
      "args": ["-y", "data-verify-mcp"],
      "type": "stdio"
    }
  }
}
VSCODEEOF
            echo "✅ Config written to $VSCODE_CONFIG"
        fi

        echo ""
        echo "📋 VSCode MCP config:"
        echo '  {'
        echo '    "servers": {'
        echo '      "data-verify": {'
        echo '        "command": "npx",'
        echo '        "args": ["-y", "data-verify-mcp"],'
        echo '        "type": "stdio"'
        echo '      }'
        echo '    }'
        echo '  }'
        ;;
    4)
        echo ""
        echo "📦 Configuring for Claude Desktop..."
        if [ "$(uname)" = "Darwin" ]; then
            CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
        else
            CLAUDE_CONFIG="$HOME/.config/Claude/claude_desktop_config.json"
        fi

        echo "📋 Add the following to your Claude Desktop config:"
        echo "   Config file: $CLAUDE_CONFIG"
        echo ""
        echo '  {'
        echo '    "mcpServers": {'
        echo '      "data-verify": {'
        echo '        "command": "npx",'
        echo '        "args": ["-y", "data-verify-mcp"]'
        echo '      }'
        echo '    }'
        echo '  }'
        ;;
    5|*)
        echo ""
        echo "📋 Manual configuration:"
        echo ""
        echo "For Claude Desktop / Cursor / Windsurf, add to config:"
        echo '  {'
        echo '    "mcpServers": {'
        echo '      "data-verify": {'
        echo '        "command": "npx",'
        echo '        "args": ["-y", "data-verify-mcp"]'
        echo '      }'
        echo '    }'
        echo '  }'
        echo ""
        echo "For Claude Code:"
        echo "  claude mcp add data-verify -- npx -y data-verify-mcp"
        echo ""
        echo "For VSCode:"
        echo '  {'
        echo '    "servers": {'
        echo '      "data-verify": {'
        echo '        "command": "npx",'
        echo '        "args": ["-y", "data-verify-mcp"],'
        echo '        "type": "stdio"'
        echo '      }'
        echo '    }'
        echo '  }'
        ;;
esac

echo ""
echo "📦 Testing MCP server..."
npx -y "$PACKAGE_NAME" --help 2>/dev/null || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "💡 With access token (unlimited usage):"
echo "   Set env: DATA_VERIFY_ACCESS_TOKEN=your_token_here"
echo ""
echo "🚀 Supported clients: Claude Desktop, Claude Code, Cursor, VSCode, Windsurf"
