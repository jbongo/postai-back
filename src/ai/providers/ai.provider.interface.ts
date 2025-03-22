export interface IAiProvider {
    /**
     * Retourne une idée de post à partir d'un thème, d'une liste de mots-clés et d'une langue.
     */
    getPostIdea(theme: string, keywords: string[], language: string): Promise<string>;
  
    /**
     * Imite le style d'un post source pour créer un post adapté à un nouveau thème.
     */
    imitatePostStyle(sourcePost: string, targetTheme: string, language: string): Promise<string>;
  
    /**
     * Crée un post à partir de zéro pour un thème donné dans une langue donnée.
     */
    createPostFromScratch(theme: string): Promise<string>;

    translatePost(prompt: string): Promise<string>;
  }
  