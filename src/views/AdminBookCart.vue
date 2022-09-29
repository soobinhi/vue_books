<template>
<v-app>
  <v-container>
     <v-card-title>
        <v-icon>shopping_cart</v-icon>&nbsp;대여장바구니
        <v-spacer></v-spacer>
        <v-btn
                      color="blue darken-1"
                      text
                      @click="reset"
                    >
                      비우기
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="rental"
                    >
                      대여
                    </v-btn>
      </v-card-title>
    <v-data-table
            style="width: 100%"
            :headers="headers"
            :items="contents"
            sort-by="idx"
            sort-desc="true">

  </v-data-table>
  
  </v-container>
</v-app>
</template>

<script>
  
  export default {
    name: 'App',
    data: () => ({
      headers: [
        { text: '번호', value:'idx'},
        { text: '도서명', value: 'title' },
        { text: '대여희망자', value: 'name' },
      ],
      contents:[],
      detailItem:[],
    }),
    created(){
      this.getData()
    },
    methods:{
      async getData(){
        console.log(this.$store.state.rentalList)
        this.contents = this.$store.state.rentalList
        for(let i=0; i<this.contents.length;i++){
          this.contents[i].idx = i+1
        }
        console.log(this.contents)
      },
      reset(){
        if (confirm("대여 장바구니를 비우시겠습니까?")) {
            this.$store.commit('delRentalList')
            alert('대여 장바구니를 비웠습니다.')
            this.getData()
          } 
      },
      async rental(){
        const date = new Date();
        for(let i=0; i<this.contents.length;i++){
          this.contents[i].rental_date = date
        }
         console.log(JSON.stringify(this.contents))
         try {
          this.$axios
            .post("http://127.0.0.1:8000/book/adminrental/", JSON.stringify(this.contents), {
              headers: {
                "Content-Type": `application/json`,
                "Authorization": `Token `+this.$store.state.token,
              },
            })
            .then((res) => {
              console.log(res)
              if (res.status === 200) {
                this.$store.commit('delRentalList')
                alert('대여가 완료되었습니다.');
                this.getData()
              }
            });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
</script>