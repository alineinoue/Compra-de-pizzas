//Função para substituir o querySelector
const c = (el)=>document.querySelector(el);
const c_all = (el)=>document.querySelectorAll(el);

let cart = [];        //array carrinho de compras
let modalQt = 1;     //quantidade de pizzas
let modalKey = 0;   //identificação de qual pizza está selecionada

//Mapear as pizzas
//Clonar a estrutura e preencher as informações das pizzas
//Listagens das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Setar um atributo para saber o id de cada pizza 
    pizzaItem.setAttribute('data-key', index);

    //Adicionar informações das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Evento para clicar e abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); //Evitar que ao clicar a página atualize
        let key = e.target.closest('.pizza-item').getAttribute('data-key');      //Necessário sair do elemento 'a' e ir para o elemento 'pizza-item'
        modalQt = 1; //Sempre que abrir o modal a quantidade é 1 por padrão                                            //closest serve para achar o elemento mais próximo
        modalKey = key;
        //Preencher as informações das pizzas no modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected'); //Remove o item que está selecionado 
        c_all('.pizzaInfo--size').forEach((size, sizeIndex)=>{       //Tamanho das pizzas
            if(sizeIndex == 2 ) {
                size.classList.add('selected');     //Ele deixa o tamanho grande definido por padrão
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]; //Necessário acessar cada um dos indexs.
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
        
        //Animação ao abrir modal (já configurado no css)
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

        //Abrir o modal
        c('.pizzaWindowArea').style.display = 'flex';
    });

    c('.pizza-area').append( pizzaItem );
    //Não é utilizado o innerHTML pois ele faz uma substituição, já o append adiciona
});

//Eventos do MODAL    
//Função que fecha o modal (inverso do de abrir)
//Não há necessidade de parâmetro pois se trata de uma div
function closeModal(){            
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//Botões cancelar que executam a função closeModal
c_all('.pizzaInfo--cancelMobileButton , .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Botôes para adicionar quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
c_all('.pizzaInfo--size').forEach((size, sizeIndex)=>{       //Tamanho das pizzas
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected'); //Remove o item que está selecionado 
        size.classList.add('selected');
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Qual a pizza?
    //console.log("Pizza: "+modalKey);
    //Qual o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //console.log("Tamanho: "+size);
    //Quantas pizzas?
    //console.log("Quantidade: "+modalQt);

    //Identificador para juntar pizzas de tamanhos iguais
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //Dos identifiers do carrinho qual tem o mesmo identifier
    let key = cart.findIndex((item)=>item.identifier == identifier);

    //Se achou o mesmo identificador adiciona a quantidade
    if (key>-1){
        cart[key].qt += modalQt;
    } else { 
        cart.push({         //Adicionar um objeto
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0 ){
        c('aside').style.left = '0';    //abre aside MOBILE
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';    //fecha aside MOBILE
})

function updateCart(){

    c('.menu-openner span').innerHTML = cart.length;    //Carrinho de compras no MOBILE

    //Se tiver itens no carrinho -> mostrar o carrinho
    //Se não -> não mostrar
    if (cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; //zerar as listas 

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            //Identificar qual a pizza e as suas informações
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id); //é find e não findIndex, pois deve retornar o item inteiro.
            //clonar o cartItem
            subtotal += cart[i].qt * pizzaItem.price; //Subtotal PREÇO

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; //Concatenar o nome com o tamanho da pizza
            //preencher as informações no carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if (cart[i].qt > 1){    //Usa o índice i pois já está dentro de um laço for.
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);  //Remover item do carrinho caso tenha menos que 1 unidade.
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            c('.cart').append(cartItem);
        }

            desconto = subtotal * 0.1; //Desconto de 10%
            total = subtotal - desconto;
        
            //Como é o último item do span usa-se last-child
            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';    //MOBILE
    }
}
