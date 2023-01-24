import db from "../config/database.js";
import { registerBookSchema } from "../schemas/bookSchemas.js";

const books = [
  {
    title: "The art of computer programming",
    author: "Donald Knut",
    synopsis: `The Art of Computer Programming (TAOCP) is a 
    comprehensive monograph written by the computer scientist Donald Knuth 
    presenting programming algorithms and their analysis`,
    cover:
      "https://books.google.com.br/books/publisher/content?id=x9AsAwAAQBAJ&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U18LoWV0ELI6AGO1xNaHTjfh8PlTg&w=1280",
    price: 150.0,
    type: "physical",
    stock: 2,
  },
  {
    title: "Aprendendo Node: Usando JavaScript no Servidor",
    author: "Shelley Powers",
    synopsis: `Reúna o conhecimento de programação que você já usa no navegador e empregue no servidor com o Node! 
    Aprenda a criar aplicações em rede de alto desempenho e plenamente escalonáveis nesta plataforma baseada em JavaScript. 
    O conteúdo deste livro é bastante prático, “mão na massa”, e fará com que o programador de JavaScript, acostumado a lidar apenas com processamento no navegador, 
    domine com maestria os fundamentos do Node no servidor. Serão abordados inúmeros módulos nativos e também de terceiros. Esta edição foi atualizada para abranger tanto a mais recente versão tradicional (Long Term Support – LTS) do Node quanto a versão estável mais atual.`,
    cover:
      "https://m.media-amazon.com/images/P/B07S9GB1Y9.01._SCLZZZZZZZ_SX500_.jpg",
    price: 61.75,
    type: "digital",
    downloadLink:
      "https://www.amazon.com.br/Aprendendo-Node-Usando-JavaScript-servidor-ebook/dp/B07S9GB1Y9/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=&sr=",
  },
  {
    title: "React - Aprenda Praticando:",
    author: "Maurício Samy Silva",
    synopsis: `React é uma biblioteca para a criação de sites, interfaces gráficas e aplicações web, criada pelo Facebook, e seu uso tem crescido muito, sendo usada por grandes empresas, como Netflix, Walmart e The New York Times. 
    Neste livro, eminentemente prático, Maujor, com sua reconhecida didática, fornece ao leitor uma visão detalhada dos conceitos básicos e recursos da biblioteca React.`,
    cover:
      "https://m.media-amazon.com/images/I/51ATqZkXSzL._SX363_BO1,204,203,200_.jpg",
    price: 61.98,
    type: "digital",
    downloadLink:
      "https://www.amazon.com.br/Aprendendo-Node-Usando-JavaScript-servidor-ebook/dp/B07S9GB1Y9/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=&sr=",
  },
];

async function insertBooks() {
  let count = 0;
  for (const book of books) {
    const { error, value } = registerBookSchema.validate(book);
    if (error) {
      console.error(
        "insertBooks erro:",
        error.details.map((err) => err.message)
      );
    } else {
      await db.collection("books").insertOne(value);
      count++;
    }
  }
  console.log(`inseriu ${count} livros`);
  process.exit(0);
}

insertBooks();
