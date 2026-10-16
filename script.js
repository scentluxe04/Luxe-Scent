const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const productCards = document.querySelectorAll(".product-card");

// ================= PAGINATION =================

const productsPerPage = 12;
let currentPage = 1;

function showPage(page) {
    const visibleProducts = Array.from(productCards).filter(function(card) {
        return card.dataset.filtered !== "true";
    });

    const totalPages = Math.ceil(visibleProducts.length / productsPerPage);

    if (totalPages === 0) {
        productCards.forEach(function(card) {
            card.style.display = "none";
        });

        renderPagination(0);
        return;
    }

    if (page > totalPages) {
        page = totalPages;
    }

    currentPage = page;

    // Fshij të gjitha nga pamja
    productCards.forEach(function(card) {
        card.style.display = "none";
    });

    // Shfaq vetëm 12 parfumet e faqes
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    visibleProducts.slice(start, end).forEach(function(card) {
        card.style.display = "";
    });

    renderPagination(totalPages);
}


function renderPagination(totalPages) {
    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    // Butoni "Mbrapa"
    const previousButton = document.createElement("button");
    previousButton.textContent = "‹";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", function() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    pagination.appendChild(previousButton);


    // Numrat e faqeve
    for (let i = 1; i <= totalPages; i++) {

        const pageButton = document.createElement("button");

        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", function() {
            showPage(i);
        });

        pagination.appendChild(pageButton);
    }


    // Butoni "Përpara"
    const nextButton = document.createElement("button");
    nextButton.textContent = "›";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", function() {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    pagination.appendChild(nextButton);
}


// Fillimi
showPage(1);

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    productCards.forEach(function(card) {
        const productName = card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchTerm)) {
            card.dataset.filtered = "false";
        } else {
            card.dataset.filtered = "true";
        }
    });

    currentPage = 1;
    showPage(1);
}

searchInput.addEventListener("input", searchProducts);
searchButton.addEventListener("click", searchProducts);

const categoryFilters = document.querySelectorAll(".category-filter");

categoryFilters.forEach(function(filter) {
    filter.addEventListener("click", function() {

        const selectedCategory = this.dataset.category;

        productCards.forEach(function(card) {

            const category = card.querySelector(".category").textContent.trim();

            if (category === selectedCategory) {
                card.dataset.filtered = "false";
            } else {
                card.dataset.filtered = "true";
            }

        });

        searchInput.value = "";
        currentPage = 1;
        showPage(1);
    });
});

const showAll = document.getElementById("showAll");

showAll.addEventListener("click", function() {

    productCards.forEach(function(card) {
        card.dataset.filtered = "false";
    });

    searchInput.value = "";
    currentPage = 1;
    showPage(1);
});

const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");

const perfumeDetails = {

    "9 AM DIVE by Afnan": {
        topNotes: "Limon, Mente, Rrush i Zi dhe Piper Rozë",
        heartNotes: "Mollë jeshile, Dru Kedri dhe Temjan",
        baseNotes: "Xhinxher, Dru Sandali, Patchouli dhe Jasemin",
        size: "100 ml",
        description: "Një aromë e freskët, perfekte për këdo që pëlqen aromat detare."
    },

    "9 AM POUR FEMME by Afnan": {
        topNotes: "Mandarinë, Bergamot, Grejpfrut",
        heartNotes: "Mjedër dhe Rrush i Zi",
        baseNotes: "Myshk, Amber dhe Portokall",
        size: "100 ml",
        description: "Një aromë e freskët dhe frutore, perfekte për femrat që pëlqejnë aromat e ëmbla."
    },

    "9 PM ELIXIR by Afnan": {
        topNotes: "Arrëmyshk, Elemi dhe Kardamom",
        heartNotes: "Pimento, Livando dhe Lëkurë",
        baseNotes: "Ciste, Labdanum, Patchouli dhe Vanilje",
        size: "100 ml",
        description: "Një aromë e ngrohtë dhe magnetike, perfekte për ata që duan të lënë një përshtypje të paharrueshme."
    },

    "RAYHAAN AQUACITA by Rayhaan": {
        topNotes: "Limon, Qumësht Kokosi, Bergamot dhe Mandarinë",
        heartNotes: "Kallam Sheqeri, Jasemin, Hibiskus dhe Gardenia",
        baseNotes: "Rum, Myshk, Fasule Tonka dhe Patchouli",
        size: "100 ml",
        description: "Një aromë tropikale dhe ekzotike, perfekte për ata që kërkojnë një parfum të freskët dhe me energji pozitive."
    },

    "ASAD ELIXIR by Lattafa": {
        topNotes: "Piper Rozë, Shafran dhe Grejpfrut",
        heartNotes: "Duhan, Dru Kedri dhe Vanilje",
        baseNotes: "Patchouli, Temjan, Cashmeran dhe Amber i thatë",
        size: "100 ml",
        description: "Një aromë e fuqishme dhe e ngrohtë, me një karakter misterioz dhe shumë tërheqës."
    },

    "ASAD BOURBON by Lattafa": {
        topNotes: "Kumbull Mirabelle, Livando dhe Piper Rozë",
        heartNotes: "Kakao, Arrëmyshk dhe Davana",
        baseNotes: "Vanilje Bourbon, Amber dhe Vetiver",
        size: "100 ml",
        description: "Një aromë e ngrohtë dhe karizmatike, perfekte për ata që pëlqejnë aromat e ëmbla, pikante dhe me një prekje vaniljeje."
    },

    "HAWAS DIVA by Rasasi": {
        topNotes: "Fruta të Kuqe, Rabarbar dhe Litchi ekzotike",
        heartNotes: "Trëndafil, Temjan dhe Dru Kedri",
        baseNotes: "Vanilje, Myshk dhe Ambragris",
        size: "100 ml",
        description: "Një aromë magjepsëse dhe femërore, me një kombinim të ëmbël frutash, lulesh dhe vaniljeje që të lë një gjurmë elegante."
    },

    "KHAMRAH DUKHAN by Lattafa": {
        topNotes: "Pimento, Erëza të Tymosura dhe Mandarinë",
        heartNotes: "Temjan, Labdanum, Patchouli dhe Lulja e Portokallit",
        baseNotes: "Duhan, Praline, Amber, Fasule Tonka dhe Benzoin",
        size: "100 ml",
        description: "Një aromë e ngrohtë dhe misterioze. Një kombinim i ëmbëlsisë, erëzave dhe duhanit që krijon një aromë tërheqëse."
    },

    "ECLAIRE by Lattafa": {
        topNotes: "Karamel, Qumësht dhe Sheqer",
        heartNotes: "Mjaltë dhe Lule të Bardha",
        baseNotes: "Vanilje, Pralinë dhe Myshk",
        size: "100 ml",
        description: "Një aromë e ëmbël, kremoze dhe elegante, perfekte për ata që pëlqejnë aromat e ngrohta dhe të ëmmbla."
    },

    "FAKHAR BLACK by Lattafa": {
        topNotes: "Mollë Jeshile, Bergamot dhe Xhinxher",
        heartNotes: "Livando, Sherebelë, Manaferra Dëllinje dhe Barbarozë",
        baseNotes: "Fasule Tonka, Amberwood, Dru Kedri dhe Vetiver",
        size: "100 ml",
        description: "Një aromë moderne dhe energjike, perfekte për meshkujt që pëlqejnë aromat e freskëta, aromatike dhe me një bazë të ngrohtë."
    },

    "HAWAS FIRE by Rasasi": {
        topNotes: "Esclarea",
        heartNotes: "Notat Detare dhe Jasemin Egjiptian",
        baseNotes: "Amber, Notat Minerale dhe Ambragris",
        size: "100 ml",
        description: "Një aromë e fuqishme dhe elegante, me një karakter të ngrohtë, modern dhe plot prezencë."
    },

    "RiiFFS FREEZE IN FLAMES": {
        topNotes: "Mjaltëz/Mente, Mjedër, Mollë e Kuqe, Bergamot i Kalabrisë dhe Fruti i pasionit",
        heartNotes: "Mente, Livando, Çaj dhe Sherebelë",
        baseNotes: "Myshk dhe Dru Kedri",
        size: "100 ml",
        description: "Një aromë e freskët, frutore dhe menteje që sjell një kontrast unik mes freskisë akullnajore dhe ngrohtësisë magnetike, perfekte për ata që kërkojnë një parfum të paharrueshëm për çdo stinë."
    },

    "FREEZE by RiiFFS": {
        topNotes: "Mente, Lëkurë Limoni, Bergamot i Kalabrisë, Grejpfrut dhe Akord dëbore",
        heartNotes: "Akord akulli, Çaj, Xhinxher dhe Sherebelë",
        baseNotes: "Ambermax, Lule bozhure dhe Dru Kedri",
        size: "100 ml",
        description: "Një shpërthim freskie që të jep ndjesinë e akullit që në spërkatjen e parë."
    },

    "HAWAS ICE by Rasasi": {
        topNotes: "Mollë e ngrirë, Limon Italian, Bergamot Siçilian dhe Anise Yll",
        heartNotes: "Kumbull, Lule Portokalli dhe Kardamom",
        baseNotes: "Myshk, Qelibar, Dru i shkarkuar nga deti dhe Myshk Kristal",
        size: "100 ml",
        description: "Një aromë tropikale dhe ujore, perfekte për ata që kërkojnë një parfum energjik, modern dhe magnetik që garanton komplimente."
    },

    "HAWAS PINK by Rasasi": {
        topNotes: "Kanellë, Arrëmyshk dhe Neroli",
        heartNotes: "Marshmallow, Tuberose dhe Lule Portokalli",
        baseNotes: "Pambuk Sheqeri, Vanilje dhe Fasule Tonka",
        size: "100 ml",
        description: "Një aromë e ëmbël, elegante dhe femërore, me një hapje pikante, një zemër të pasur me lule të bardha dhe një bazë të ëmbël gourmand."
    },

    "KHAMRAH by Lattafa": {
        topNotes: "Kanellë, Arrëmyshk dhe Bergamot",
        heartNotes: "Hurma Arabie, Pralinë, Tuberose dhe Mahonial",
        baseNotes: "Vanilje, Fasule Tonka, Dru Qelibari, Temjan, Benzoin dhe Akigalawood",
        size: "100 ml",
        description: "Një aromë e ngrohtë dhe drunore, perfekte për ata që kërkojnë një parfum intensiv dhe me jetëgjatësi të jashtëzakonshme."
    },

    "KISS by Rayhaan": {
        topNotes: "Luleshtrydhe, Kokos, Pralinë dhe Mjedër",
        heartNotes: "Qumësht i kondensuar, Karamel, Lule portokalli dhe Lule të bardha",
        baseNotes: "Vanilje, Fasule Tonka, Myshk dhe Dru sandali",
        size: "100 ml",
        description: "Një aromë e ëmbël, frutore dhe kremoze, me një kombinim të shijshëm të luleshtrydhes, kokosit, karamelit dhe vaniljes."
    },

    "ODYSSEY MANDARIN SKY by Armaf": {
        topNotes: "Mandarinë, Portokall, Shafran dhe Sherebelë",
        heartNotes: "Karamel, Fasule Tonka dhe Lulja Tagetes",
        baseNotes: "Ambroxan, Dru Kedri dhe Vetiver",
        size: "100 ml",
        description: "Një aromë tropikale dhe plot dritë me freskinë e ëmbël të mandarinës, perfekte për ata që kërkojnë një parfum energjik, pozitiv dhe plot freski."
    },

    "ODYSSEY MANDARIN SKY ELIXIR by Armaf": {
        topNotes: "Mandarinë, Portokall, Livando, Kardamom dhe Piper i Zi",
        heartNotes: "Karamel, Fasule Tonka, Temjan dhe Patchouli",
        baseNotes: "Vanilje dhe Vetiver",
        size: "100 ml",
        description: "Një aromë tropikale dhe tejet e ëmbël me freskinë e mandarinës dhe karamelit të ngrohtë, perfekte për ata që kërkojnë një parfum energjik dhe plot freski."
    },

    "MARWA by Arabiyat Prestige": {
        topNotes: "Bergamot Kalabrie, Limon dhe Portokall Siçilian",
        heartNotes: "Xhinxher i Nigerisë, Neroli i Tunizisë dhe Kanellë e Ceilonit",
        baseNotes: "Çaj i Zi Kinez, Ambroksan, Temjan dhe Dru Guaiac",
        size: "100 ml",
        description: "Një aromë e freskët, me një kombinim të bukur citrus, pikant, woody dhe musk. Perfekte për ata që pëlqejnë aromat e pastra dhe të rafinuara."
    },

    "MINERALE GOLD by Maison Alhambra": {
        topNotes: "Shafran dhe Mandarinë Italiane",
        heartNotes: "Osmanthus, Gjethe Manushaqe dhe Immortelle",
        baseNotes: "Nota Minerale, Lëkur Kamoshi, Akigalawood, Myshk, Dru Kedri dhe Patchouli",
        size: "100 ml",
        description: "Një aromë elegante, moderne dhe misterioze, me një karakter mineral, pikant dhe drunor. Perfekte për ata që pëlqejnë aromat unike dhe luksoze."
    },

    "NATURAL FOREST by Al Haramain": {
        topNotes: "Portokall, Koriandër, Lëvore Limoni, Mente, Rrush i Zi pa farë dhe Limon",
        heartNotes: "Kajsi, Trëndafil Maji, Borzilok dhe Fara Karote",
        baseNotes: "Hurma Arabie, Fik dhe Ambrette",
        size: "100 ml",
        description: "Një aromë tropikale dhe e freskët, perfekte për ata që pëlqejnë aromat jeshile dhe të pastra, me një prekje frutore të ngrohtë."
    },

    "NEW YORK - THE CITY OF DREAMS by Lattafa Pride": {
        topNotes: "Qershi, Arrëmyshk dhe Piper i Zi",
        heartNotes: "Konjak, Mimoza, Trëndafil dhe Lule Shpatore",
        baseNotes: "Patchouli, Labdanum, Dru Kedri dhe Myshk Lisi",
        size: "100 ml",
        description: "Një aromë unisex, elegante dhe misterioze, me një kombinim të veçantë të qershisë, erëzave, luleve dhe një baze të ngrohtë drunore."
    },

    "ODYSSEY AQUA by Armaf": {
        topNotes: "Portokall, Grejpfrut dhe Artemisia",
        heartNotes: "Mente dhe Livando",
        baseNotes: "Ambroksan, Selvi dhe Patchouli",
        size: "100 ml",
        description: "Një aromë ujore dhe freskuese, me një kombinim citrus, aromatik dhe drunor."
    },

    "ODYSSEY PINK POP by Armaf": {
        topNotes: "Luleshtrydhe, Ananas, Mjedër, Mandarinë, Pjeshkë dhe Mollë",
        heartNotes: "Lule Portokalli, Jasemin, Magnolia, Trëndafil, Qumësht Kokosi dhe Qelibar",
        baseNotes: "Vanilje, Dru Sandali, Myshk dhe Qelibar",
        size: "100 ml",
        description: "Një aromë e ëmbël, frutore dhe elegante, perfekte për femrat që pëlqejnë aromat fresh, floral dhe me një prekje të butë e kremoze."
    },

    "KHAMRAH QAHWA by Lattafa": {
        topNotes: "Kanellë, Kardamom dhe Xhinxher",
        heartNotes: "Pralinë, Fruta të Sheqerosura dhe Lule të Bardha",
        baseNotes: "Kafe Arabika, Vanilje, Fasule Tonka, Benzoin dhe Myshk",
        size: "100 ml",
        description: "Një aromë e ngrohtë dhe e ëmbël, perfekte për ata që pëlqejnë aromat gourmand, pikante dhe me një prekje të pasur kafeje."
    },

    "QUEEN OF ARABIA by Lattafa": {
        topNotes: "Kokos dhe Kripë",
        heartNotes: "Dru Sandali dhe Lule Dielli",
        baseNotes: "Vanilje dhe Qelibar",
        size: "100 ml",
        description: "Një aromë elegante, kremoze dhe luksoze, perfekte për femrat që duan të lënë një përshtypje të paharrueshme."
    },

    "RAYHAAN ELIXIR by Rayhaan": {
        topNotes: "Mente dhe Bergamot",
        heartNotes: "Livando dhe Benzoin",
        baseNotes: "Vanilje, Fasule Tonka, Mjaltë dhe Duhan",
        size: "100 ml",
        description: "Një aromë e ngrohtë, pikante dhe e pasur me nuanca të ëmbla të vaniljes dhe mjaltit, perfekte për ata që kërkojnë një parfum intensiv, joshës dhe afatgjatë për mbrëmjet e ftohta."
    },

    "SAFA by Arabiyat Prestige": {
        topNotes: "Litchi, Lajthi dhe Fruta të Kuqe",
        heartNotes: "Trëndafil, Magnolia dhe Cipriol",
        baseNotes: "Vanilje, Ambragris dhe Akord Gourmand",
        size: "100 ml",
        description: "Një aromë elegante, e ëmbël dhe femërore, me një kombinim të bukur frutash, lulesh dhe notash gourmand."
    },

    "SHIYAAKA SHADOW by Khadlaj": {
        topNotes: "Grejpfrut, Livando dhe Piper rozë",
        heartNotes: "Qelibar, Dru kedri dhe Dru kashmiri",
        baseNotes: "Myshk lisi, Patchouli dhe Myshk",
        size: "100 ml",
        description: "Një aromë elegante, misterioze dhe tërheqëse, perfekte për ata që pëlqejnë aromat e pasura, të ngrohta dhe me karakter."
    },

    "SHIYAAKA SKY by Khadlaj": {
        topNotes: "Verbena, Bergamot dhe Mandarinë",
        heartNotes: "Neroli, Lule Portokalli, Akord i Gjelbër dhe Barbarozë",
        baseNotes: "Myshk, Ambroksan, Vetiver dhe Dru Sandali",
        size: "100 ml",
        description: "Një aromë e freskët dhe e pastër, perfekte për ditët e ngrohta dhe për ata që duan një parfum me ndjesi të lehtë, enrgjike dhe shumë tërheqëse."
    },

    "ART OF UNIVERSE by Lattafa": {
        topNotes: "Mandarinë, Xhinxher, Bergamot dhe Mente",
        heartNotes: "Dardhë dhe Lule Portokalli",
        baseNotes: "Myshk, Qelibar dhe Dru Kedri",
        size: "100 ml",
        description: "Një aromë e freskët, citrus dhe elegante, me një kombinim energjik agrumesh, menteje, dardhe dhe notash drunore."
    },

    "YARA CANDY by Lattafa": {
        topNotes: "Rrush i Zi pa farë dhe Mandarinë e Gjelbër",
        heartNotes: "Karamele e Shkrifët Luleshtrydheje dhe Gardenia",
        baseNotes: "Vanilje, Myshk, Qelibar dhe Dru Sandali",
        size: "100 ml",
        description: "Një aromë e ëmbël, femërore dhe super playful, perfekte për ato që pëlqejnë aromat vanilje-frutore."
    },

    "YARA ELIXIR by Lattafa": {
        topNotes: "Ëmbëlsirë Luleshtrydheje dhe Rrush i Zi pa farë",
        heartNotes: "Jasemin dhe Lule Portokalli",
        baseNotes: "Vanilje, Karamel, Qelibar dhe Myshk",
        size: "100 ml",
        description: "Një aromë e ëmbël, kremoze dhe joshëse, me një karakter femëror dhe shumë tërheqës. Një kombinim i frutave të ëmbla dhe luleve delikate që lë një gjurmë të paharrueshme."
    },

    "YARA MOI by Lattafa": {
        topNotes: "Dardhë, Piper Rozë dhe Rrush i Zi pa farë",
        heartNotes: "Tuberose, Jasemin dhe Lajthi/Bajame",
        baseNotes: "Vanilje, Kashmeran dhe Patchouli",
        size: "100 ml",
        description: "Një aromë e ëmbël, elegante dhe femërore, perfekte për ato që pëlqejnë aromat kremoze, vaniljore dhe me një prekje të ngrohtë."
    },

    "YARA TOUS by Lattafa": {
        topNotes: "Mango, Kokos dhe Fruti i Pasionit",
        heartNotes: "Jasemin, Lule Portokalli dhe Heliotrop",
        baseNotes: "Vanilje, Myshk dhe Kashmeran",
        size: "100 ml",
        description: "Një aromë tropikale, e ëmbël dhe femërore, perfekte për ato që pëlqejnë aromat frutore, kremoze dhe verore."
    },

    "ASAD ZANZIBAR by Lattafa": {
        topNotes: "Piper i Zi dhe Livando",
        heartNotes: "Ujë Kokosi i Kripur dhe Lule Shpatore",
        baseNotes: "Vanilje dhe Temjan",
        size: "100 ml",
        description: "Një aromë e freskët, elegante dhe misterioze, perfekte për ata që pëlqejnë aromat detare me një prekje të ëmbël."
    },

    "Momento by Riiffs": {
        topNotes: "Sheqer, Shafran dhe Mandarinë",
        heartNotes: "Fasule Tonka, Trëndafil Damasku dhe Oud",
        baseNotes: "Karamel, Amberwood dhe Dru Kedri",
        size: "100 ml",
        description: "Një aromë joshëse, perfekte për ata që duan të lënë pas një përshtypje të paharrueshme."
    },

    "Rasasi Hawas Lava Gold": {
        topNotes: "Ananas, Grejpfrut, Mollë dhe Limon",
        heartNotes: "Lëkurë, Shafran, Oud dhe Mjedër",
        baseNotes: "Qelibar, Patchouli, Myshk i bardhë dhe Karamel",
        size: "100 ml",
        description: "Një aromë e fuqishme dhe elegante, ideale për meshkuj që duan të bien në sy dhe të lënë një përshtypje të fortë."
    },

    "Al Haramain Amber Oud Gold Edition": {
        topNotes: "Bergamot dhe Nota Jeshile",
        heartNotes: "Pjepër, Ananas, Amber dhe Nota Gourmand",
        baseNotes: "Vanilje, Myshk dhe Nota Drunore",
        size: "120 ml",
        description: "Një aromë luksoze dhe e ëmbël, perfekte për ata që duan një parfum të veçantë dhe që tërheq vëmendjen."
    },

    "Lattafa Badee Al Oud Amethyst Fusion": {
        topNotes: "Amaretto, Rum dhe Mandarinë",
        heartNotes: "Amber, Karamel dhe Patchouli",
        baseNotes: "Vanilje, Benzoinë dhe Dru Sandali",
        size: "100 ml",
        description: "Një aromë e ngrohtë dhe luksoze, perfekte për mbrëmje dhe raste speciale, sidomos për ditët e freskëta."
    },

    "Arabiyat Prestige - Al Noor": {
        topNotes: "Kardamom, Shafran dhe Arrëmyshk",
        heartNotes: "Fik, Iris, Labdanum dhe Vetiver",
        baseNotes: "Lëkurë, Tonka, Patchouli dhe Vanilje",
        size: "100 ml",
        description: "Aromë elegante dhe misterioze, perfekte për mbrëmje dhe për ata që preferojnë një stil të sofistikuar e të veçantë."
    },

    "Rasasi Hawas Gold Digger": {
        topNotes: "Dardhë,Mente, Livando dhe Bergamot",
        heartNotes: "Kanellë dhe Sherebelë",
        baseNotes: "Vanilje, Amber, Dru Kedri dhe Patchouli",
        size: "100 ml",
        description: "Aromë moderne dhe tërheqëse, perfekte për meshkuj që duan një stil të ëmbël, elegant dhe me prezencë."
    },

    "Rasasi Hawas Thunder": {
        topNotes: "Bergamot, Mollë dhe Xhenxhefil",
        heartNotes: "Nota pikante",
        baseNotes: "Nota drunore dhe Amber",
        size: "100 ml",
        description: "Aromë moderne dhe energjike, perfekte për meshkuj që duan një stil të freskët, elegant dhe me prezencë."
    },

    "Rasasi Hawas Reina": {
        topNotes: "Kajsi, Dardhë dhe Kanellë",
        heartNotes: "Jasemin, Frangipani, Lule Portokalli, Kokos dhe Kafe",
        baseNotes: "Vanilje, Myshk i Bardhë, Amber, Dru Sandali dhe Sheqer",
        size: "100 ml",
        description: "Një aromë e ëmbël dhe femërore, perfekte për mbrëmje dhe raste speciale."
    },

    "Arabiyat Prestige - Uhud": {
        topNotes: "Fruta të kuqe, Trëndafil dhe Karamel",
        heartNotes: "Tonka, Mjaltë dhe Mjedër",
        baseNotes: "Vanilje, Myshk i Bardhë dhe Amber",
        size: "100 ml",
        description: "Një aromë e ëmbël dhe joshëse, perfekte për ata që duan një parfum të ngrohtë, elegant dhe të paharrueshëm."
    },

    "Fakhar Women": {
        topNotes: "Fruta, Zambak, Shegë dhe Aldehide",
        heartNotes: "Tuberose, Jasemin, Gardenia, Ylang-Ylang, Trëndafil, Dorëzonjë dhe Bozhure",
        baseNotes: "Vanilje, Myshk i Bardhë, dru Sandali dhe Ambroxan",
        size: "100 ml",
        description: "Një aromë elegante dhe femërore, perfekte për përditshmëri dhe raste ku dëshiron të ndihesh e kuruar dhe plot hijeshi."
    },

    "Lattafa Niche Emarati Khanjar": {
        topNotes: "Arrëmyshk, Xhenxhefil dhe Pimento",
        heartNotes: "Cashmeran, Violetë dhe Patchouli",
        baseNotes: "Vetiver, Temjan, Myshk dhe Lëkurë",
        size: "100 ml",
        description: "Një aromë elegante dhe me karakter, perfekte për ata që preferojnë një stil të sofistikuar dhe të dallueshëm."
    },

    "Badee Al Oud - Oud for Glory": {
        topNotes: "Shafran, Arrëmyshk dhe Livandë",
        heartNotes: "Oud dhe Patchouli",
        baseNotes: "Oud, Patchouli dhe Myshk",
        size: "100 ml",
        description: "Aromë e fuqishme dhe luksoze, perfekte për ata që preferojnë parfume me karakter të thellë dhe prezencë të veçantë."
    },

    "Lattafa Pride Love in Paris": {
        topNotes: "Mollë e karamelizuar",
        heartNotes: "Pomarose, Shurup Panje dhe Benzoinë",
        baseNotes: "Tonka e pjekur, Patchouli, Amber dhe Cashmeran",
        size: "100 ml",
        description: "Një aromë e ëmbël dhe romantike, perfekte për ata që duan një parfum të ngrohtë, elegant dhe të paharrueshëm."
    },

    "Glacier Bella": {
        topNotes: "Dardhë dhe Bergamot",
        heartNotes: "Nota florale dhe Lëkurë",
        baseNotes: "Amber, Myshk, Vanilje dhe Vetiver",
        size: "100 ml",
        description: "Aromë e ëmbël, perfekte për femrat që duan të duken të kuruara dhe tërheqëse gjatë gjithë ditës."
    },

    "Odyssey Go Mango": {
        topNotes: "Mango, Bergamot dhe Limon",
        heartNotes: "Jasemin, Lule Portokalli dhe Kokos",
        baseNotes: "Vanilje, Amber, Myshk dhe Dru Sandali",
        size: "100 ml",
        description: "Një aromë tropikale dhe energjike, perfekte për ditët e ngrohta dhe për ata që duan një parfum të ëmbël e të gjallë."
    },

    "Odyssey Aoud": {
        topNotes: "Shafran, Arrëmyshk dhe Livando",
        heartNotes: "Oud dhe Nota drunore",
        baseNotes: "Ambroxan, myshk dhe Patchouli",
        size: "100 ml",
        description: "Një aromë elegante dhe me karakter, perfekte për meshkuj që duan një stil të fuqishëm dhe të sofistikuar."
    },

    "Odyssey Marshmallow": {
        topNotes: "Kokos, Mollë, Limon, Bozhure dhe Zambak i luginës",
        heartNotes: "Marshmallow, Luleshtrydhe, Mjedër, Pjeshkë, Kajsi dhe Lule Portokalli",
        baseNotes: "Mascarpone, Vanilje, Praline, Myshk, Tonka dhe Amber",
        size: "100 ml",
        description: "Një aromë e ëmbël, kremoze dhe joshëse, perfekte për ata që duan një parfum të butë e të paharrueshëm."
    },

    "Nocturno Elixir - Rayhaan": {
        topNotes: "Lëkurë Limoni, Bergamot, Mente dhe Artemisia",
        heartNotes: "Livando, Geranium dhe Ananas",
        baseNotes: "Sandal dhe Amberwood",
        size: "100 ml",
        description: "Një aromë me karakter misterioz dhe elegant, ideale për mbrëmje kur dëshiron të lësh një përshtypje të fortë."
    },

    "Arabiyat Prestige Ramad Earthy": {
        topNotes: "Bergamot, Piper Rozë dhe Kardamom",
        heartNotes: "Iris, Jasemin dhe Trëndafil",
        baseNotes: "Vetiver, Patchouli, Amber dhe Dru Sandali",
        size: "100 ml",
        description: "Një aromë e rafinuar dhe tokësore, perfekte për ata që preferojnë një stil të qetë, elegant dhe me personalitet."
    },

    "Khadlaj Island Dreams": {
        topNotes: "Kokos, Bergamot dhe Ananas",
        heartNotes: "Qumësht Kokosi, Jasemin dhe Ylang-Ylang",
        baseNotes: "Vanilje, Myshk dhe Dru Sandali",
        size: "100 ml",
        description: "Një aromë tropikale dhe e ëndërruar, ideale për ditët e ngrohta dhe për një ndjesi pushimesh gjatë gjithë ditës."
    },

    "Rasasi Hawas Eclat": {
        topNotes: "Litchi, Bergamot, Dardhë dhe Fistik",
        heartNotes: "Trëndafil dhe Temjan",
        baseNotes: "Vanilje, Amber, Myshk dhe Nota drunore",
        size: "100 ml",
        description: "Një aromë elegante dhe e ëmbël, perfekte për femrat që duan një stil romantik, modern dhe të rafinuar."
    }
};

let currentProduct = null;
const addToCartModal = document.querySelector(".order-modal");

productCards.forEach(function(card) {

    card.addEventListener("click", function(event) {
        if (event.target.closest(".add-to-cart")) {
            return;
        }

        const image = card.querySelector(".product-image img");
        const category = card.querySelector(".category");
        const name = card.querySelector("h3");
        const price = card.querySelector("strong");

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCategory.textContent = category.textContent;
        modalName.textContent = name.textContent;
        modalPrice.textContent = price.textContent;
        
        currentProduct = {
            name: name.textContent.trim(),
            price: Number(
                price.textContent
                    .replace(/\./g, "")
                    .replace(/,/g, "")
                    .replace(" L", "")
                    .trim()
            ),
            image: image.src
        };
        
        const details = perfumeDetails[name.textContent.trim()];

        if (details) {
            document.getElementById("modalTopNotes").textContent = details.topNotes;
            document.getElementById("modalHeartNotes").textContent = details.heartNotes;
            document.getElementById("modalBaseNotes").textContent = details.baseNotes;
            document.getElementById("modalSize").textContent = details.size;
            document.getElementById("modalDescription").textContent = details.description;
        }
        productModal.classList.add("active");
    });

});

closeModal.addEventListener("click", function() {
    productModal.classList.remove("active");
});

productModal.addEventListener("click", function(event) {
    if (event.target === productModal) {
        productModal.classList.remove("active");
    }
});

const decreaseQuantity = document.getElementById("decreaseQuantity");
const increaseQuantity = document.getElementById("increaseQuantity");
const quantityDisplay = document.getElementById("quantity");

function validateQuantity() {
    const value = Number(quantityDisplay.value);

    if (!Number.isInteger(value) || value < 1) {
        quantityDisplay.value = 1;
    }
}

increaseQuantity.addEventListener("click", function () {
    validateQuantity();
    quantityDisplay.value = Number(quantityDisplay.value) + 1;
});

decreaseQuantity.addEventListener("click", function () {
    validateQuantity();

    if (Number(quantityDisplay.value) > 1) {
        quantityDisplay.value = Number(quantityDisplay.value) - 1;
    }
});

quantityDisplay.addEventListener("change", validateQuantity);
quantityDisplay.addEventListener("blur", validateQuantity);

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

cartButton.addEventListener("click", function () {
    cartOverlay.classList.add("active");
});

closeCart.addEventListener("click", function () {
    cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", function (event) {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }
});

let cart = [];



function addProductToCart(product, quantity) {

    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    renderCart();
}

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.stopPropagation();

        const card = this.closest(".product-card");

        const name = card.querySelector("h3").textContent.trim();

        const priceText = card.querySelector("strong").textContent.trim();

        const price = Number(
            priceText
                .replace(/\./g, "")
                .replace(/,/g, "")
                .replace(" L", "")
                .trim()
        );

        const image = card.querySelector(".product-image img").src;

        addProductToCart(
            {
                name: name,
                price: price,
                image: image
            },
            1
        );

        cartOverlay.classList.add("active");
    });

});

addToCartModal.addEventListener("click", function () {

    if (!currentProduct) {
        return;
    }

    const quantity = Number(quantityDisplay.value) || 1;

    addProductToCart(
        {
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image
        },
        quantity
    );

    quantityDisplay.value = 1;

    productModal.classList.remove("active");
    cartOverlay.classList.add("active");
});

function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Shporta është bosh.</p>
        `;

        cartTotal.textContent = "0 L";
        cartCount.textContent = "0";

        return;
    }

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>

                <p>${item.price.toLocaleString("en-US")} L</p>

                <div class="cart-item-quantity">
                    <button class="cart-decrease" data-name="${item.name}">−</button>

                    <span>${item.quantity}</span>

                    <button class="cart-increase" data-name="${item.name}">+</button>
                </div>
            </div>

            <div class="cart-item-actions">

                <strong class="cart-item-total">
                    ${itemTotal.toLocaleString("en-US")} L
                </strong>

                <button class="remove-cart-item" data-name="${item.name}">
                     Hiq
                </button>

            </div>
        `;

        cartItems.appendChild(cartItem);
    });

        const decreaseButtons = document.querySelectorAll(".cart-decrease");
    const increaseButtons = document.querySelectorAll(".cart-increase");

    decreaseButtons.forEach(function(button) {
        button.addEventListener("click", function() {

            const productName = this.dataset.name;

            const product = cart.find(item => item.name === productName);

            if (product && product.quantity > 1) {
                product.quantity--;
                renderCart();
            }
        });
    });

    increaseButtons.forEach(function(button) {
        button.addEventListener("click", function() {

            const productName = this.dataset.name;

            const product = cart.find(item => item.name === productName);

            if (product) {
                product.quantity++;
                renderCart();
            }
        });
    });

    const removeButtons = document.querySelectorAll(".remove-cart-item");

    removeButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const productName = this.dataset.name;

            cart = cart.filter(function(item) {
                return item.name !== productName;
            });

            renderCart();
        });
    });

    cartTotal.textContent = total.toLocaleString("en-US") + " L";
    cartCount.textContent = totalQuantity;
}

const checkoutButton = document.getElementById("checkoutButton");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Shporta është bosh.");
        return;
    }

    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    checkoutTotal.textContent =
        total.toLocaleString("en-US") + " L";

    cartOverlay.classList.remove("active");
    checkoutOverlay.classList.add("active");
});


closeCheckout.addEventListener("click", function() {
    checkoutOverlay.classList.remove("active");
});


checkoutOverlay.addEventListener("click", function(event) {

    if (event.target === checkoutOverlay) {
        checkoutOverlay.classList.remove("active");
    }

});

emailjs.init({
    publicKey: "_ivGsOmacG-yoQM9Q"
});

checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Shporta është bosh.");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const customerCity = document.getElementById("customerCity").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    let orderItems = "";
    let total = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        orderItems +=
            item.name +
            " × " +
            item.quantity +
            " — " +
            itemTotal.toLocaleString("en-US") +
            " L\n";
    });

    const templateParams = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_city: customerCity,
        customer_address: customerAddress,
        payment_method: paymentMethod,
        order_items: orderItems,
        order_total: total.toLocaleString("en-US")
    };

    const confirmButton = document.querySelector(".confirm-order");

    confirmButton.disabled = true;
    confirmButton.textContent = "Duke dërguar...";

    emailjs.send(
        "service_uaasjlr",
        "template_6tjgxfg",
        templateParams
    )
    .then(function() {

        alert("Porosia u dërgua me sukses! 🤍");

        checkoutForm.reset();

        cart = [];

        renderCart();

        checkoutOverlay.classList.remove("active");

        confirmButton.disabled = false;
        confirmButton.textContent = "Konfirmo porosinë";

    })
    .catch(function(error) {

        console.error("EmailJS error:", error);

        alert(
            "Ndodhi një problem gjatë dërgimit të porosisë. Ju lutem provoni përsëri."
        );

        confirmButton.disabled = false;
        confirmButton.textContent = "Konfirmo porosinë";
    });

});