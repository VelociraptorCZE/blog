// Copyright (c) Simon Raichl 2022

(async () => {
    const articleDetail = document.getElementById("articleDetail");

    const fetchArticle = async () => {
        try {
            const articleId = location.search.match(/a=.+?(?=&|$)/)[0]?.replace("a=", "");
            const response = await fetch(`articles/${articleId}.json`);

            if (response.ok) {
                return response.json();
            }
        } catch {}
    }

    const getArticleContent = (article, languages) => {
        const language = localStorage.language || "en";

        return article[language] || article[languages[0]];
    };

    const renderLanguageBar = (article, languages) => {
        const bar = document.createElement("section");
        bar.insertAdjacentText("beforeend", "Language:");

        languages.forEach(language => {
            const languageSwitch = document.createElement("a");
            languageSwitch.href = "#";
            languageSwitch.style.padding = ".25rem";
            languageSwitch.insertAdjacentHTML("beforeend", language);
            languageSwitch.addEventListener("click", e => {
                e.preventDefault();
                localStorage.language = language;
                renderArticle(article, languages);
            });

            bar.insertAdjacentElement("beforeend", languageSwitch);
        });

        articleDetail.insertAdjacentElement("beforeend", bar);
    };

    const renderTitle = title => {
        const articleTitle = document.createElement("h1");
        articleTitle.insertAdjacentText("beforeend", title);
        articleDetail.insertAdjacentElement("beforeend", articleTitle);
    };

    const renderDate = date => {
        const dateTitle = document.createElement("h4");
        dateTitle.insertAdjacentText("beforeend", date);
        articleDetail.insertAdjacentElement("beforeend", dateTitle);
    };

    const renderParagraphs = paragraphs => {
        paragraphs.forEach(paragraph => {
            const p = document.createElement("p");
            p.insertAdjacentHTML("beforeend", paragraph);
            articleDetail.insertAdjacentElement("beforeend", p);
        });
    };

    const renderArticle = (article, languages) => {
        const { date, content } = article;
        const { title, paragraphs } = getArticleContent(content, languages);
        articleDetail.innerHTML = "";

        renderLanguageBar(article, languages);
        renderTitle(title);
        renderDate(date);
        renderParagraphs(paragraphs);
    };

    try {
        const article = await fetchArticle();

        if (article === void 0) {
            articleDetail.insertAdjacentText("beforeend", "Article not found.");
        } else {
            const languages = Object.keys(article.content);
            renderArticle(article, languages);
        }
    } catch (e) {
        console.warn(e);
        articleDetail.insertAdjacentText("beforeend", "Something went wrong.");
    }
})();