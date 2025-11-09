DROP TABLE IF EXISTS post;
CREATE TABLE IF NOT EXISTS post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    tags TEXT
);

-- Tabela virtual FTS5 com tokenizer otimizado
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
    title,
    content,
    excerpt,
    tags,
    content='post',
    content_rowid='id',
    tokenize='porter unicode61 remove_diacritics 1'
);

-- Trigger para sincronizar FTS5 ao inserir
CREATE TRIGGER IF NOT EXISTS posts_fts_insert
AFTER INSERT ON post
BEGIN
    INSERT INTO posts_fts(rowid, title, content, excerpt, tags)
    VALUES (NEW.id, NEW.title, NEW.content, NEW.excerpt, NEW.tags);
END;


-- Trigger para sincronizar FTS5 ao atualizar
CREATE TRIGGER IF NOT EXISTS posts_fts_update
AFTER UPDATE ON post
BEGIN
    UPDATE posts_fts
    SET title = NEW.title, content = NEW.content, excerpt = NEW.excerpt, tags = NEW.tags
    WHERE rowid = NEW.id;
END;


-- Trigger para sincronizar FTS5 ao deletar
CREATE TRIGGER IF NOT EXISTS posts_fts_delete
AFTER DELETE ON post
BEGIN
    DELETE FROM posts_fts WHERE rowid = OLD.id;
END;
