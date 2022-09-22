<template>
<v-app>
  <v-container>
     <v-card-title>
        <v-icon>article</v-icon>&nbsp;나의 예약목록
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
            sort-desc="true">
  
     <template v-slot:top>
      
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">예약 내역</span>
            </v-card-title>
            
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
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
                      v-model="detailItem.reserve_date"
                      label="대여일자"
                      readonly="readonly" 
                      
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.book_status"
                      label="도서상태"
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
                @click="rental">대여</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="del_reserve">예약취소</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="close"> 닫기</v-btn>
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
      btnvalue:'대출',
      headers: [
        { text: '번호', value: 'book_id.id' },
        { text: '책 제목', value: 'book_id.title' },
        { text: '예약일자', value: 'reserve_date' },
        { text: '도서상태', value: 'book_id.book_status' },
      ],
      contents:[],
      detailItem:[],
    }),
    created(){
      this.getData()
    },
    methods:{
      async getData(){
        await this.$axios.get('http://127.0.0.1:8000/book/reserve/?user_id='+this.$store.state.user_id).then((response) => { 
          console.log(response.data)
            for(var i=0;i<response.data.length;i++){
                response.data[i].reserve_date = new Date(response.data[i].reserve_date).toLocaleDateString();
                 var status = response.data[i].book_id.book_status;
                 if(status=='0'){
                    response.data[i].book_id.book_status = '반납완료';
                }else if(status=='1'){
                    response.data[i].book_id.book_status = '대여중';
                }else if(status=='2'){
                  response.data[i].book_id.book_status = '반납승인대기';
                }else{
                  response.data[i].book_id.book_status = '대여가능';
                }
            }
          this.contents = response.data;
      })
      },
      handleClick(value) {
        console.log(value)
        this.detailItem = value;
        this.detailItem.title = value.book_id.title;
        this.detailItem.book_status = value.book_id.book_status;
        this.dialog = true;
    },close () {
        this.dialog = false
        this.$nextTick(() => {
        })
      },book_return(){
        alert(this.detailItem.book_id.id)
        this.$axios.get('http://127.0.0.1:8000/book/return/'+this.detailItem.book_id.id).then((response) => {
          console.log(response.status);  
          if(response.status=='200'){
            this.getData()
            alert('반납 신청이 완료되었습니다.');
            this.dialog = false
          }
        })
      },del_reserve(){
        this.$axios.get('http://127.0.0.1:8000/book/del_reserve/'+this.detailItem.id).then((response) => {
          console.log(response.status);  
          if(response.status=='200'){
            this.getData()
            alert('예약취소가 완료되었습니다.');
            this.dialog = false
          }
        })
      }
    }
  }
</script>