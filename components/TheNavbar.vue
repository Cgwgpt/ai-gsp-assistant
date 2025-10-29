<div 
  v-show="isAdminMenuOpen" 
  class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1"
>
  <router-link 
    to="/admin/users" 
    class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
  >
    用户管理
  </router-link>
  <router-link 
    to="/bot-management" 
    class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
  >
    数智人管理
  </router-link>
  <router-link 
    to="/bot-authorization" 
    class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
  >
    授权管理
  </router-link>
  <router-link 
    to="/admin/usage" 
    class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
  >
    用量管理
  </router-link>
</div>

<router-link 
  v-if="userStore.user"
  to="/my-bots" 
  class="text-gray-600 hover:text-gray-900"
>
  我的数智人
</router-link>
<router-link 
  v-if="userStore.user"
  to="/usage" 
  class="text-gray-600 hover:text-gray-900"
>
  我的用量
</router-link>
<button 
  @click="handleLogout"
  class="text-gray-600 hover:text-gray-900"
>
  退出
</button>

<div v-if="userStore.isAdmin()">
  <div class="px-3 py-2 text-sm font-medium text-gray-500">管理选项</div>
  <router-link 
    to="/admin/users" 
    class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  >
    用户管理
  </router-link>
  <router-link 
    to="/bot-management" 
    class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  >
    数智人管理
  </router-link>
  <router-link 
    to="/bot-authorization" 
    class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  >
    授权管理
  </router-link>
  <router-link 
    to="/admin/usage" 
    class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  >
    用量管理
  </router-link>
</div>
<router-link 
  v-if="userStore.user"
  to="/my-bots" 
  class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
>
  我的数智人
</router-link>
<router-link 
  v-if="userStore.user"
  to="/usage" 
  class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
>
  我的用量
</router-link> 