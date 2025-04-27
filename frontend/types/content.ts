export interface ContentPackage {
    script: {
      intro: string;
      body: string;
      conclusion: string;
    };
    graphics: string[];
    thumbnails: string[];
  }
  
  // In your component:
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);