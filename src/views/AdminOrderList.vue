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
            @click:row="handleClick"
            style="width: 100%"
            :headers="headers"
            :items="contents"
            :items-per-page="5"
            :search="search"
            sort-by="id"
            sort-desc="true">>
     <template v-slot:top>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">주문 상세</span>
            </v-card-title>
            
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="3"
                    md="3"
                  >
                  <img class="imageStyle" :src="detailItem.image" style="width:100px;"
                  >  
                  </v-col>
                  <v-col
                    cols="12"
                    sm="9"
                    md="9"
                  >
                    <v-text-field
                      v-model="detailItem.title"
                      label="제목"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.order_date"
                      label="주문일"
                      readonly="readonly" 
                      
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.name"
                      label="요청자"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.reason"
                      label="신청사유"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.order_status"
                      label="주문상태"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                {{btnvalue}}
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                닫기
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
  </v-data-table>
  </v-container>
</v-app>
</template>

<script>
  
  export default {
    name: 'App',
    data: () => ({
      dialog: false,
      search: '',
      btnvalue:'승인',
      headers: [
        { text: '번호', value: 'id' },
        { text: '제목', value: 'title' },
        { text: '주문일', value: 'order_date', dataType: "Date" },
        { text: '주문상태', value: 'order_status' },
        { text: '주문자', value: 'user_id.name' }
      ],
      contents:[],
      detailItem:[],
    }),
    created(){
      this.getData()
    },
    methods:{
      async getData(){
        await this.$axios.get('http://127.0.0.1:8000/order/').then((response) => { 
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
      },
      handleClick(value) {
        this.detailItem = value;
        this.detailItem.name = value.user_id.name
        this.dialog = true;
        if(value.order_status=='승인'){
          this.btnvalue='입고완료'
        }else{
          this.btnvalue='승인'
        }
    },close () {
        this.dialog = false
      },save(){
        this.$axios.get('http://127.0.0.1:8000/order/status/'+this.detailItem.id).then((response) => {
          console.log(response.status);  
          if(response.status=='200'){
            this.getData()
            alert('결재가 완료되었습니다.');
            this.dialog = false
          }
        })
      }
    }
  }
</script>