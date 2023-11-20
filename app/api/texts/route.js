export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const language = searchParams.get('language')

    const selectedLanguage = language || 'pt-br';

    const texts = {
        "pt-br": {
            "title": "Olá!👋 Eu sou o Thiago Crepequer",
            "subtitle": "Desenvolvedor Full-Stack na missão de transformar café em código!"
        },
        "en": {
            "title": "Hello!👋 I'm Thiago Crepequer",
            "subtitle": "Full-Stack Developer on a mission to transform coffee into code!"
        }
    };

    if (!texts[selectedLanguage]) {
        return Response.json({ error: 'Language not found' }, { status: 404 });
    }

    return Response.json(texts[selectedLanguage], { status: 200 });
};