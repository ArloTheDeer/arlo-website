# Arlo Website

A Next.js static website featuring integrated Obsidian vault synchronization. This project allows you to seamlessly sync your Obsidian notes to a static website that will be deployed on Cloudflare Pages.

## Features

- 📝 **Obsidian Integration**: Sync your entire Obsidian vault to the website
- 🔄 **Automatic Filtering**: Excludes hidden files and system directories (`.obsidian`, `.trash`, etc.)
- 📁 **Structure Preservation**: Maintains your original folder hierarchy
- ⚡ **Static Generation**: Built with Next.js for optimal performance
- ☁️ **Cloudflare Pages Ready**: Optimized for Cloudflare Pages deployment
- 🔧 **Simple Commands**: One-command vault synchronization

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- An Obsidian vault

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd arlo-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up Obsidian vault configuration:
```bash
cp config-example.yaml config.yaml
```

4. Edit `config.yaml` and update the `obsidian_vault_path` to point to your Obsidian vault:
```yaml
obsidian_vault_path: "/path/to/your/obsidian/vault"
```

### Usage

#### Sync Obsidian Vault
```bash
npm run copy-obsidian-vault
```

This command will:
- Clear the existing `public/notes-src` directory
- Copy all files from your Obsidian vault
- Automatically filter out hidden files and directories
- Preserve your folder structure

#### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

#### Build for Production
```bash
npm run build
```

## Project Structure

```
arlo-website/
├── app/                    # Next.js app directory
├── public/
│   └── notes-src/         # Synced Obsidian vault content
├── scripts/
│   └── copy-obsidian-vault.js  # Vault sync script
├── docs/
│   └── specs/             # Project specifications and documentation
├── config-example.yaml    # Example configuration file
└── config.yaml           # Your personal configuration (excluded from git)
```

## Future Features

- 🎨 **Obsidian Canvas Support**: Display Obsidian canvas files
- 🌈 **Syntax Highlighting**: Code blocks with syntax highlighting
- 📊 **Mermaid Diagrams**: Render Mermaid diagrams from markdown
- 📐 **LaTeX Support**: Mathematical formula rendering

## Development

This project uses:
- **Next.js 15** - React framework for static site generation
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ShellJS** - Cross-platform Unix shell commands
- **js-yaml** - YAML parser for configuration

## Deployment

The website is designed to be deployed on **Cloudflare Pages**:

1. Build the static site:
```bash
npm run build
```

2. Deploy the `out/` directory to Cloudflare Pages

## Documentation

For detailed implementation information, see:
- [Project Goals](./GOALS.md)
- [Feature Specifications](./docs/specs/)

## Contributing

This is a personal project, but feel free to open issues or submit pull requests if you find any problems or have suggestions for improvements.
