<template>
	<header>
		<div v-if ="$store.state.token">
		<v-app-bar app color="indigo"  >
				<v-btn icon>
					<v-icon style="color:white" @click="$router.replace('/home')">home</v-icon>
				</v-btn>
				<v-app-bar-title style="color:white">도서관리시스템</v-app-bar-title>
				<v-spacer></v-spacer>
				<v-btn icon>
					<v-icon style="color:white">perm_identity</v-icon>
				</v-btn>
				<div v-if ="$store.state.is_admin">
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
						color="white"
						dark
						v-bind="attrs"
						v-on="on"
						>
						<v-icon style="color:white">manage_accounts</v-icon>
						</v-btn>
					</template>
					<v-list>
						<v-list-item @click="$router.replace('/admin/orderlist/')">
						<v-list-item-title>입고요청목록</v-list-item-title>
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

