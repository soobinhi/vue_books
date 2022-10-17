<template>
<v-app>
  <v-container>
     <v-card-title>
        <v-icon>article</v-icon>&nbsp;도서상세
        <v-spacer></v-spacer>
        <v-btn
                color="blue darken-1"
                text
                @click="back"
              >
                목록
              </v-btn>
      </v-card-title>
  </v-container>
        <v-container style="width:90%">
                <v-row>
                  <v-col
                    cols="12"
                    sm="3"
                    md="3"
                  >
                  <img class="imageStyle" :src="detailItem.image" style="height:150px;"
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
                      v-model="detailItem.author"
                      label="저자"
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
                    <div v-if="detailItem.book_status==0">
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      담기
                    </v-btn>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                  <v-select
                    @change="check_overdue"
                    v-model="user_auth"
                    label="대여희망자"
                    :items="userData"
                    item-text="name"
                    item-value="user_id"
                    return-object
                    >
                </v-select>
                
                  </v-col>
                </v-row>
        </v-container>
    <v-container style="width:90%">
     <v-card-title>
        <v-icon>article</v-icon>&nbsp;도서 대여 현황
      </v-card-title>
    <v-data-table
            style="width: 100%"
            :headers="headers"
            :items="contents"
            :items-per-page="5"
            :search="search"
            sort-by="id"
            sort-desc="true">
  </v-data-table>
  </v-container>
</v-app>
</template>
<script>
export default {
    name: 'App',
    data: () => ({
      detailItem:[],
      userData: [],
      user_auth: '',
      headers: [
        { text: '대여일자', value: 'rental_date' },
        { text: '반납일자', value: 'return_date' },
        { text: '연장여부', value: 'is_extension' },
        { text: '반납기한', value: 'scheduled_date' },
        { text: '도서상태', value: 'book_id.book_status' },
        { text: '대여자', value: 'user_id.name'}
      ],
      contents:[],
    }),
    created(){
      this.getData();
    },
    methods:{
      async getData(){
        await this.$axios.get('http://127.0.0.1:8000/book/detail/'+this.$route.params.id).then((response) => { 
            console.log(response)
            this.detailItem = response.data;
            this.userList();
            
      })
      },
      async userList(){
        await this.$axios.get('http://127.0.0.1:8000/users/list/').then((response) => { 
            console.log(response)
            this.userData = response.data;
            this.getTable();
      })
      },async getTable(){
        await this.$axios.get('http://127.0.0.1:8000/book/rental/?book_id='+this.detailItem.id).then((response) => { 
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
                }else{
                  response.data[i].book_id.book_status = '반납승인대기';
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
      back(){
        this.$router.go(-1);
      },
      save(){
        if(this.user_auth==''){
          alert('대여 희망자를 선택해주세요.')
        }else{
         this.$store.commit('addRentalList', { book_id: this.detailItem.id, user_id: this.user_auth.user_id, title: this.detailItem.title, name: this.user_auth.name})
         console.log(this.$store.state.rentalList);
          if (confirm("대여 장바구니에 담았습니다. 장바구니로 이동하시겠습니까?")) {
            this.$router.push('/admin/bookcart')
          } else {
            this.$router.push('/admin/book')
          }
        }
      },
      check_overdue(value){
          this.$axios.get('http://127.0.0.1:8000/book/check_overdue/'+value.user_id).then((response) => {
            console.log(response)
            if(response.data.status=='ok'){ 
              if(response.data.data>0){
                let overdue = response.data.data
                if (confirm(overdue+"일 연체중입니다. 연체료 "+overdue*100+"원을 납부하시겠습니까?")){
                  this.$axios.get('http://127.0.0.1:8000/book/pay_overdue/'+value.user_id).then((response) => { 
                    console.log(response)
                    if(response.status=='200'){
                      alert('연체료가 지불되었습니다.')
                    }
                  })
                }else{
                  alert(value.name+"님은 "+response.data.data+"일 동안 대여가 불가능합니다.");
                  this.user_auth = '';
                }
              }
            }else{
              alert('연체중인 책을 먼저 반납해주세요.');
              this.user_auth = '';
            }
          })
      }
    }
  }
</script>