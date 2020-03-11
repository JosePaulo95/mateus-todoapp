
var App = new Vue({
  el: "#app",
  data() {
    return {
      testApi: "",
      search: "",
      selectedCard: null,
      selectedItem: null,
      cards: [
        {
          name: "Tarefas de casa",
          cardColor: "info",
          dt_previsao_utc: "2019-02-02",
          dt_previsao_br: "02/02/2019",
          items: [
            {
              titulo: "Limpar a varanda",
              dt_previsao_utc: "2019-02-02",
              dt_previsao_br: "02/02/2019",
              dt_entregue_br: "há 2 semanas",
            },
            {
              titulo: "Lavar a louça",
              dt_previsao_utc: "2019-02-02",
              dt_previsao_br: "02/02/2019",
              dt_entregue_br: null
            }
          ]
        },
        {
          name: "Projeto 2",
          cardColor: "info",
          dt_previsao_utc: "2018-02-02",
          dt_previsao_br: "02/02/2018",
          items: [
            {
              titulo: "tarefa 1",
              dt_previsao_utc: "2018-01-10",
              dt_previsao_br: "10/01/2018",
              dt_entregue_br: null
            },
            {
              titulo: "tarefa 2",
              dt_previsao_utc: "2019-02-02",
              dt_previsao_br: "02/02/2019",
              dt_entregue_br: null
            }
          ]
        }
      ]     
    }
  },  
  computed: {
    projetosFiltradosOrdenados(){
      function compareDtPrevisao(a, b) {
        if (a.dt_previsao_utc < b.dt_previsao_utc)
          return -1;
        if (a.dt_previsao_utc > b.dt_previsao_utc)
          return 1;
        return 0;
      }

      return this.projetosResultadoBusca().sort(compareDtPrevisao);
    },
  },
  
  methods: {
    tarefasOrdenadas(projeto){
      function compareDtPrevisao(a, b) {
        if (a.dt_previsao_utc < b.dt_previsao_utc)
          return -1;
        if (a.dt_previsao_utc > b.dt_previsao_utc)
          return 1;
        return 0;
      }
      return projeto.items.sort(compareDtPrevisao);
    },
    projetosResultadoBusca() {
      var _this = this
      if(this.search.length <= 2){
        return this.cards
      } else {
        return this.cards.map(function(card) {
          return {
            name: card.name,
            cardColor: card.cardColor,
            dt_previsao_utc: card.dt_previsao_utc,
            dt_previsao_br: card.dt_previsao_br,
            items: card.items.filter(function (item) {
              return item.titulo.includes(_this.search)
            })
          }
        })
      }
    },
    createCard () {
      var f1 = document.getElementById('f1');
      var titulo_input = document.getElementById('input-projeto-titulo');

      var repetidos = this.cards.filter(function (card) {
        return card.name === titulo_input.value
      })

      if (repetidos.length>0) {
        titulo_input.setCustomValidity("Já existe um projeto com este título.");
      } else {
        titulo_input.setCustomValidity("");//tem q resetar
      }
      if(f1.checkValidity()){
        const titulo =    document.getElementById('input-projeto-titulo').value;
        const previsao =  document.getElementById('input-projeto-previsao').value;
        const previsao_br = moment(previsao).locale("pt-BR").format("L")
        
        let new_card = {
          name: titulo,
          cardColor: "info",
          dt_previsao_utc: previsao,
          dt_previsao_br: previsao_br,
          items: []
        };
        this.cards.push(new_card)
        this.closeModal('modal-card')
      }
    },
    removeCard (card) {
      this.cards.splice(this.cards.indexOf(card), 1)
    },
    removeItem () {
      const card_index = this.cards.indexOf(this.selectedCard)
      const item_index = this.cards[card_index].items.indexOf(this.selectedItem)

      this.cards[card_index].items.splice(item_index, 1)

      this.closeModal("edit-tarefa-modal")
    },
    openModalCriacaoTarefa(card){
      this.selectedCard = card
      this.openModal('create-task-modal')
    },
    createTask () {
      var form = document.getElementById('create-task-form');
      var titulo_input = document.getElementById('input-tarefa-titulo');

      var repetidos = this.selectedCard.items.filter(function (item) {
        return item.titulo === titulo_input.value
      })

      if (repetidos.length>0) {
        titulo_input.setCustomValidity("Este projeto já contém uma tarefa com este título.");
      } else {
        titulo_input.setCustomValidity("");//tem q resetar
      }

      if(form.checkValidity()){
        const titulo =    document.getElementById('input-tarefa-titulo').value;
        const previsao =  document.getElementById('input-tarefa-previsao').value;
        const previsao_br = moment(previsao).locale("pt-BR").calendar()

        const new_item = {
          titulo: titulo,
          dt_previsao_utc: previsao,
          dt_previsao_br: previsao_br,
          dt_entregue_br: null
        };

        const card_index = this.cards.indexOf(this.selectedCard)
        this.cards[card_index].items.push(new_item)
        this.closeModal('create-task-modal')
      }
    },
    completeTask(card, item){
      const card_index = this.cards.indexOf(card)
      const item_index = this.cards[card_index].items.indexOf(item)

      this.cards[card_index].items[item_index].dt_entregue_br = moment().locale("pt-BR").calendar()
    },
    openModalEdicaoProjeto(card){
      this.selectedCard = card

      const titulo_field = document.getElementById('edit-projeto-titulo');
      titulo_field.value = card.name;
      const previsao_field = document.getElementById('edit-projeto-previsao');
      previsao_field.value = card.dt_previsao_utc;
      //const previsao_field =  document.getElementById('input-tarefa-previsao');
      this.openModal('edit-projeto-modal')
    },
    openModalEdicaoTarefa(item, card){
      this.selectedItem = item
      this.selectedCard = card

      const titulo_field = document.getElementById('edit-tarefa-titulo');
      titulo_field.value = item.titulo;
      const previsao_field = document.getElementById('edit-tarefa-previsao');
      previsao_field.value = item.dt_previsao_utc;
      //const previsao_field =  document.getElementById('input-tarefa-previsao');
      this.openModal('edit-tarefa-modal')
    },
    editProjeto(){
      var f = document.getElementById('edit-projeto-form');
      var titulo_input = document.getElementById('edit-projeto-titulo');
      var mudou_titulo = titulo_input.value !== this.selectedCard.name;

      var repetidos = mudou_titulo?this.cards.filter(function (card) {
        return card.name === titulo_input.value
      }):[];

      if (repetidos.length>0) {
        titulo_input.setCustomValidity("Já existe um projeto com este título.");
      } else {
        titulo_input.setCustomValidity("");//tem q resetar
      }
      if(f.checkValidity()){
        const titulo =    document.getElementById('edit-projeto-titulo').value;
        const previsao =  document.getElementById('edit-projeto-previsao').value;
        const previsao_br = moment(previsao).locale("pt-BR").format("L");
          
        const card_index = this.cards.indexOf(this.selectedCard);

        this.cards[card_index].name = titulo
        this.cards[card_index].dt_previsao_utc = previsao
        this.cards[card_index].dt_previsao_br = previsao_br

        this.closeModal('edit-projeto-modal')
      }
    },
    editTarefa(){
      var f = document.getElementById('edit-tarefa-form');
      var titulo_input = document.getElementById('edit-tarefa-titulo');
      var mudou_titulo = titulo_input.value !== this.selectedItem.titulo;

      var repetidos = mudou_titulo?this.selectedCard.items.filter(function (item) {
        return item.titulo === titulo_input.value
      }):[];

      if (repetidos.length>0) {
        titulo_input.setCustomValidity("Este projeto já contém uma tarefa com este título.");
      } else {
        titulo_input.setCustomValidity("");//tem q resetar
      }
      if(f.checkValidity()){
        const titulo =    document.getElementById('edit-tarefa-titulo').value;
        const previsao =  document.getElementById('edit-tarefa-previsao').value;
        const previsao_br = moment(previsao).locale("pt-BR").calendar();
          
        const card_index = this.cards.indexOf(this.selectedCard)
        const item_index = this.cards[card_index].items.indexOf(this.selectedItem)

        this.cards[card_index].items[item_index].titulo = titulo
        this.cards[card_index].items[item_index].dt_previsao_utc = previsao
        this.cards[card_index].items[item_index].dt_previsao_br = previsao_br

        this.closeModal('edit-tarefa-modal')
      }
    },
    clearSearchField () {
      this.search = ''
    },
    openModal(id){
      document.getElementById(id).classList.add('is-active');      
    },
    closeModal(id){
      document.getElementById(id).classList.remove('is-active');
    }
  }
});
