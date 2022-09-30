<template>
  <v-container style="width: 450px">
    <v-layout align-center row wrap style="margin-top:50px">
      <v-flex xs12 style='width:100%'>
        <v-alert v-if="isError" type="error">
          {{ errorMsg }}
        </v-alert>
        <v-card>
          <v-toolbar flat color="indigo">
            <v-toolbar-title
              ><span class="white--text">도서요청</span></v-toolbar-title
            >
          </v-toolbar>
          <div class="mt-3 d-flex flex-row-reverse" style="width: 90%; margin-left:20px">
            <v-btn
                  color="blue"
                  @click="bookSearch"
                >
                  검색
                </v-btn>
               <v-text-field
                v-model="search"
                style="width: 80%"
                :counter="10"
                label="도서검색"
                required
              ></v-text-field>
                
              </div>
          <div class="pa-5" style="margin-top:-20px">
            <v-form ref="form" v-model="valid" lazy-validation>
             
              
              <v-text-field
                v-model="title"
                :counter="10"
                label="제목"
                required
              ></v-text-field>

              <v-text-field
                v-model="author"
                :counter="10"
                label="저자"
                required
              ></v-text-field>

              <v-text-field 
                v-model="publisher"
                :counter="10"
                label="출판사"
                required
              ></v-text-field>

              <v-text-field
                v-model="reason"
                :counter="10"
                label="신청사유"
                required
              ></v-text-field>

              <v-text-field
                style="display:none"
                v-model="user_id"
                hidden
              ></v-text-field>

              <div class="mt-3 d-flex flex-row-reverse">

                <v-btn
                  :disabled="!valid"
                  color="blue"
                  @click="orderSubmit"
                >
                  주문하기
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-card>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" style="margin-top:10px">
        <div class="col" v-for="data in bookList" :key="data">
          <div class="card shadow-sm">
            <img class="imageStyle" :src="data.image" style="height:100px;"
            @click="orderData(data.title,data.author,data.publisher,data.isbn,data.image)"
            >
            <p class="card-text">{{data.title}}</p>
            <a @click="move(data.link)" href="#">상세보기</a>
            <div class="card-body">
              
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{data.regDate}}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      dialog: false,
      search: null,
      title: null,
      author : null,
      user_id: this.$store.state.user_id ,
      isbn: null,
      reason: null,
      image:null,
      bookList : []
    };
  },
  methods: {
    move(link){
      window.location.href = link;
    },
    async bookSearch() {
          let self = this;
          const URL = "/v1/search/book.json?query="+this.search; /*URL*/
          const clientId = 'HJDFQYUJdaXSFRCHTTkw';
          const clientSecret = 'Tioo5n28pw';

          this.$axios.get(URL,
              {headers : { 
                          'Accept' : 'application/json',
                          'X-Naver-Client-Id': clientId,
                          'X-Naver-Client-Secret': clientSecret}
              }).then((response) => { // 실제 API를 요청한다/
            console.log(response.data);
            let test = [];
            this.bookList = [];
            test = test.concat(response.data.items); // 받아온 데이터를 movieList 배열에 넣어준다.
            this.bookList = this.bookList.concat(test);
          })
    },
    orderData(title,author,publisher,isbn,image){
      this.title=title;
      this.author=author;
      this.publisher=publisher;
      this.isbn=isbn;
      this.image=image;
    },
    async orderSubmit() {
      let orderData = {};
      orderData.title=this.title;
      orderData.author=this.author;
      orderData.publisher=this.publisher;
      orderData.isbn=this.isbn;
      orderData.reason=this.reason;
      orderData.user_id=this.user_id;
      orderData.image=this.image;
      try {
        this.$axios
          .post("http://127.0.0.1:8000/order/", JSON.stringify(orderData), {
            headers: {
              "Content-Type": `application/json`,
              "Authorization": `Token `+this.$store.state.token,
            },
          })
          .then((res) => {
            console.log(res)
            if (res.status === 201) {
              this.$router.push("/order/list/");
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    },
    
};
</script>
