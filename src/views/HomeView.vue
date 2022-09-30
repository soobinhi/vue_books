<template>
<v-app>
  <v-container>
     <v-card-title>
        <v-icon>article</v-icon>&nbsp;도서목록
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
              <span class="text-h5">도서 상세</span>
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
                      v-model="detailItem.author"
                      label="작가"
                      readonly="readonly" 
                      
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.publisher"
                      label="출판사"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.isbn"
                      label="ISBN"
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
                @click="rental"
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
      btnvalue:'예약',
      headers: [
        { text: '번호', value: 'id' },
        { text: '제목', value: 'title' },
        { text: '작가', value: 'author' },
        { text: '도서상태', value: 'book_status' }
      ],
      contents:[],
      detailItem:[],
    }),
    created(){
      this.getData()
    },
    methods:{
      async getData(){
        await this.$axios.get('http://127.0.0.1:8000/book/book/').then((response) => { 
            for(var i=0;i<response.data.length;i++){
                var status = response.data[i].book_status;
                if(status=='0'){
                    response.data[i].book_status = '대여가능';
                }else if(status=='1'){
                    response.data[i].book_status = '대여중';
                }else if(status=='2'){
                    response.data[i].book_status = '반납승인대기';
                }else{
                    response.data[i].book_status = '예약중';
                }
            }
            this.contents = response.data;
      })
      },
      handleClick(value) {
        this.detailItem = value;
        if(value.book_status == '대여가능'){
          this.btnvalue = '';
        }else{
          this.btnvalue = '예약';
        }
        this.dialog = true;
        
    },close () {
        this.dialog = false
        this.$nextTick(() => {
        })
      },rental(){
        let rentalData = {};
          rentalData.user_id = this.$store.state.user_id;
          rentalData.book_id = this.detailItem.id;
        if(this.btnvalue == '예약'){
          try {
          this.$axios
            .post("http://127.0.0.1:8000/book/reserve/", JSON.stringify(rentalData), {
              headers: {
                "Content-Type": `application/json`,
                "Authorization": `Token `+this.$store.state.token,
              },
            })
            .then((res) => {
              console.log(res)
              if (res.status === 201) {
                this.getData()
                alert('예약이 완료되었습니다.');
                this.dialog = false
              }
            });
        } catch (error) {
          console.error(error);
        }
        }else{
          try {
          this.$axios
            .post("http://127.0.0.1:8000/book/rental/", JSON.stringify(rentalData), {
              headers: {
                "Content-Type": `application/json`,
                "Authorization": `Token `+this.$store.state.token,
              },
            })
            .then((res) => {
              console.log(res)
              if (res.status === 201) {
                this.getData()
                alert('대여가 완료되었습니다.');
                this.dialog = false
              }
            });
        } catch (error) {
          console.error(error);
        }
        }
      }
    }
  }
</script>