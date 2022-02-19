//Função para substituir o querySelector
const c = (el)=>document.querySelector(el);
const c_all = (el)=>document.querySelectorAll(el);

//Mapear as pizzas
//Clonar a estrutura e preencher as informações das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Adicionar informações das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Evento para clicar no + e abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); //Evitar que ao clicar a página atualize

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