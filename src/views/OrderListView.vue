<template>
<v-app>
  <v-container>
    <v-card-title>
        <v-icon>article</v-icon>&nbsp;주문목록
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="검색"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
    <v-data-table
            style="width: 100%"
            :headers="headers"
            :items="contents"
            :items-per-page="5"
            :search="search"
            sort-by="id"
            sort-desc="true">
    > </v-data-table>
  </v-container>
</v-app>
</template>

<script>
  
  export default {
    name: 'App',
    data: () => ({
      search: '',
      headers: [
        { text: '번호', value: 'id' },
        { text: '제목', value: 'title' },
        { text: '주문일', value: 'order_date'},
        { text: '주문상태', value: 'order_status' },
        { text: '주문자', value: 'user_id.name' }
      ],
      contents:[],
    }),
    created(){
      this.getData()
    },
    methods:{
      async getData(){
        await this.$axios.get('http://127.0.0.1:8000/order/').then((response) => { 
            console.log(response.data)
             for(var i=0;i<response.data.length;i++){
                var status = response.data[i].order_status;
                response.data[i].order_date = new Date(response.data[i].order_date).toLocaleString();
                if(status=='1'){
                    response.data[i].order_status = '승인대기';
                }else if(status=='0'){
                    response.data[i].order_status = '반려';
                }else if(status=='2'){
                    response.data[i].order_status = '승인';
                }else{
                    response.data[i].order_status = '입고완료';
                }
            }
            this.contents = response.data;
      })
      }
    }
  }
</script>