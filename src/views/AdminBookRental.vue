<template>
<v-app>
  <v-container>
     <v-card-title>
        <v-icon>article</v-icon>&nbsp;대여목록 관리
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="검색"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
                color="blue darken-1"
                text
                @click="checked_return"
              >
              반납
        </v-btn>
      </v-card-title>
    <v-data-table
            v-model="selected"
            @click:row="handleClick"
            style="width: 100%"
            :headers="headers"
            :items="contents"
            :items-per-page="5"
            :search="search"
            show-select
            sort-by="id"
            sort-desc="true">
  
     <template v-slot:top>
      
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">반납 / 연장</span>
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
                      v-model="detailItem.rental_date"
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
                      v-model="detailItem.scheduled_date"
                      label="반납기한"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.is_extension"
                      label="연장여부"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="detailItem.return_date"
                      label="반납일"
                      readonly="readonly" 
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="extensionval"
                color="blue darken-1"
                text
                @click="extension"
              >
                연장
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
      btnvalue:'대출',
      headers: [
        { text: '번호', value: 'book_id.id' },
        { text: '책 제목', value: 'book_id.title' },
        { text: '대여일자', value: 'rental_date' },
        { text: '반납일자', value: 'return_date' },
        { text: '연장여부', value: 'is_extension' },
        { text: '반납기한', value: 'scheduled_date' },
        { text: '도서상태', value: 'book_id.book_status' },
        { text: '대여자', value: 'user_id.name'}
      ],
      contents:[],
      detailItem:[],
      selected: [],
    }),
    created(){
      this.getData()
    },
    methods:{
      async getData(){
        this.selected = [];
        await this.$axios.get('http://127.0.0.1:8000/book/rental/').then((response) => { 
          console.log(response.data)
            for(var i=0;i<response.data.length;i++){
                let rent_date = new Date(response.data[i].rental_date)
                response.data[i].rental_date = rent_date.toLocaleDateString();
                rent_date.setDate(rent_date.getDate() + 21);
                if(response.data[i].is_extension){
                  rent_date.setDate(rent_date.getDate() + 7);
                  response.data[i].is_extension = 'O';
                }else{
                  response.data[i].is_extension = 'X';
                }
                response.data[i].scheduled_date = rent_date.toLocaleDateString();
                var status = response.data[i].book_id.book_status;
                if(status=='1'){
                  response.data[i].book_id.book_status = '대여중';
                }
                if(response.data[i].return_date != null){
                  response.data[i].return_date = new Date(response.data[i].return_date).toLocaleDateString();
                  response.data[i].book_id.book_status = '반납완료';
                }else{
                  response.data[i].return_date = '-'
                }
                let today = new Date();
                if(today>rent_date){
                  if(response.data[i].return_date == '-'){
                    response.data[i].book_id.book_status = '연체중';
                  }else{
                    response.data[i].return_date = response.data[i].return_date + ' (연체)'
                  }
                }
            }
          this.contents = response.data;
      })
      },
      handleClick(value) {
        console.log(value)
        this.detailItem = value;
        this.detailItem.title = value.book_id.title;
        this.dialog = true;
        if(value.book_id.book_status=='연체중'){
          this.extensionval = false
          this.returnval = true
        }else if(value.book_id.book_status=='반납완료'){
          this.extensionval = false
          this.returnval = false
        }else{
          this.extensionval = true
          this.returnval = true
        }
    },close () {
        this.dialog = false
        this.$nextTick(() => {
        })
      },fn_return(){
        this.$axios.get('http://127.0.0.1:8000/book/complete/'+this.detailItem.id).then((response) => {
          console.log(response.status);  
          if(response.status=='200'){
            this.getData()
            alert('반납처리가 완료되었습니다.');
            this.dialog = false
          }
        })
        console.log(this.selected)
      },
      checked_return(){
        console.log(this.selected)
         try {
          this.$axios
            .post("http://127.0.0.1:8000/book/adminreturn/", JSON.stringify(this.selected), {
              headers: {
                "Content-Type": `application/json`,
                "Authorization": `Token `+this.$store.state.token,
              },
            })
            .then((res) => {
              console.log(res)
              if (res.status === 200) {
                alert('반납이 완료되었습니다.');
                this.getData()
              }
            });
        } catch (error) {
          console.error(error);
        }
      },
        extension(){
        if(this.detailItem.is_extension=='O'){
          alert('연장은 1번만 가능합니다.');
        }else{
        this.$axios.get('http://127.0.0.1:8000/book/extension/'+this.detailItem.id).then((response) => {
          console.log(response.status);  
          if(response.status=='200'){
            this.getData()
            alert('연장이 완료되었습니다.');
            this.dialog = false
          }
        })
        }
      }
    }
  }
</script>