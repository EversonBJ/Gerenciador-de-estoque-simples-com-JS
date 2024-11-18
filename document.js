document.addEventListener('DOMContentLoaded', () => {
    let db;

    // Abrir ou criar o banco de dados
    const request = indexedDB.open("estoqueDB", 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore("produtos", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("nome", "nome", { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        displayProducts();
    };

    request.onerror = (event) => {
        console.error("Erro ao abrir o banco de dados:", event.target.errorCode);
    };

    // Adicionar produto
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = document.getElementById('productName').value;
        const productQuantity = document.getElementById('productQuantity').value;

        const transaction = db.transaction(["produtos"], "readwrite");
        const objectStore = transaction.objectStore("produtos");
        const newProduct = { nome: productName, quantidade: parseInt(productQuantity) };

        objectStore.add(newProduct).onsuccess = () => {
            document.getElementById('productForm').reset();
            displayProducts();
        };
    });

    // Exibir produtos
    function displayProducts() {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        const transaction = db.transaction(["produtos"], "readonly");
        const objectStore = transaction.objectStore("produtos");

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const li = document.createElement('li');
                li.textContent = `${cursor.value.nome} - ${cursor.value.quantidade}`;
                productList.appendChild(li);
                cursor.continue();
            }
        };
    }
});
