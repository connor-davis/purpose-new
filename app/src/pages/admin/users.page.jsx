const AdminUsersPage = () => {
  return (
    <div class="flex flex-col w-full h-full p-5">
      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Your Users</div>
          <div class="flex items-center">
            <div
              onClick={() => {}}
              class="bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out px-2 py-1 rounded cursor-pointer text-black"
            >
              Create
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
