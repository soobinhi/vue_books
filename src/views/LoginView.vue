<template>
  <v-container style="width: 450px">
    <v-layout align-center row wrap style="margin-top:50px">
      <v-flex xs12 style='width:100%'>
        <v-alert v-if="isError" type="error">
          {{ errorMsg }}
        </v-alert>
        <v-card>
          <v-toolbar flat color="indigo">
            <v-toolbar-title><span class="white--text">로그인</span></v-toolbar-title>
          </v-toolbar>
          <div class="pa-5">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="user_id"
                :counter="10"
                label="사번"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                label="비밀번호"
                hint="At least 8 characters"
                counter
                @click:append="show = !show"
              ></v-text-field>

              <div class="mt-3 d-flex flex-row-reverse">
                <v-btn
                  :disabled="!valid"
                  color="blue"
                  @click="loginSubmit"
                >
                  로그인
                </v-btn>&nbsp;
                <v-btn
                  color="blue"
                  @click="joinSubmit"
                >
                  회원가입
                </v-btn>&nbsp;
              </div>
            </v-form>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  
  
  data() {
    return {
      user_id: null,
      password: null
    };
  },
  created(){
    if(this.$store.state.user_id != '' && this.$store.state.token !=''){
    this.$router.replace('/home');
  }
  },
  methods: {
    async loginSubmit() {
      let saveData = {};
      saveData.user_id = this.user_id;
      saveData.password = this.password;
      try {
        this.$axios
          .post("http://127.0.0.1:8000/users/login/", JSON.stringify(saveData), {
            headers: {
              "Content-Type": `application/json`,
            },
          })
          .then((res) => {
            console.log(res)
            if (res.status === 200) {
              this.$store.commit("login", res.data);
              this.$router.push("/home");
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    joinSubmit(){
      this.$router.push("/join");
    }
  },
};
</script>
