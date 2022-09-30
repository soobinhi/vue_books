<template>
	<header>
		<div v-if ="$store.state.token">
		<v-app-bar app color="indigo"  >
				<v-btn icon>
					<v-icon style="color:white" @click="$router.replace('/home/')">home</v-icon>
				</v-btn>
				<v-app-bar-title style="color:white">도서관리</v-app-bar-title>
				<v-spacer></v-spacer>
				<v-btn icon color="white" @click="$router.replace('/home/')">
					도서
				</v-btn>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
						color="white"
						dark
						v-bind="attrs"
						v-on="on"
						>
						주문
						</v-btn>
					</template>
					<v-list>
						<v-list-item @click="$router.replace('/order/list/')">
						<v-list-item-title>주문현황</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/order/')">
						<v-list-item-title>주문하기</v-list-item-title>
						</v-list-item>
					</v-list>
					</v-menu>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
						color="white"
						dark
						v-bind="attrs"
						v-on="on"
						>
						My
						</v-btn>
					</template>
					<v-list>
						<v-list-item @click="$router.replace('/my/rental/')">
						<v-list-item-title>대여조회</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/my/reserve/')">
						<v-list-item-title>예약목록</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/my/orderlist/')">
						<v-list-item-title>주문목록</v-list-item-title>
						</v-list-item>
					</v-list>
					</v-menu>
				<div v-if ="$store.state.is_admin">
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
						color="white"
						dark
						v-bind="attrs"
						v-on="on"
						>
						관리자
						<p v-if="$store.state.rentalList.length>0">{{$store.state.rentalList.length}}</p>
						</v-btn>
					</template>
					<v-list>
						<v-list-item @click="$router.replace('/admin/book/')">
						<v-list-item-title>도서관리</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/admin/bookcart/')">
						<v-list-item-title>대여장바구니
						</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/admin/rental/')">
						<v-list-item-title>대여목록관리</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/admin/reserve/')">
						<v-list-item-title>예약현황관리</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/admin/orderlist/')">
						<v-list-item-title>도서주문목록</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$router.replace('/admin/bookregister/')">
						<v-list-item-title>도서등록</v-list-item-title>
						</v-list-item>
					</v-list>
					</v-menu>
				
				</div>
				<v-btn icon>
					<v-icon style="color:white" @click="logout()">logout</v-icon>
				</v-btn>
		</v-app-bar>
		</div>
	</header>
</template>

<script>
export default {
	data: () => ({
    }),
	methods:{
		logout(){
			this.$store.commit('logout')
			this.$router.replace('/')
		}
	}
}
</script>

