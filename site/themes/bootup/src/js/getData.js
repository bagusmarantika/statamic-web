// Use Vuejs to fetch the api
// const vm = new Vue({
//   el: '#table-data',
//   data: {
//       results: [],
//       currentSort:'name',
//       currentSortDir:'asc'
//   },
//   created:function() {
//     axios.get('https://data.covid19.go.id/public/api/prov.json')
//     .then(res => {
//       this.results = res.data.list_data;
//     })
//   },
//   // mounted() {
//   //   axios.get("https://data.covid19.go.id/public/api/prov.json").then(response => {
//   //     this.results = response.data.list_data
//   //   });
//   // },
//   methods:{
//     sort:function(s) {
//       //if s == current sort, reverse
//       if(s === this.currentSort) {
//         this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
//       }
//       this.currentSort = s;
//     }
//   },
//   computed:{
//     sortedCats:function() {
//       return this.results.sort((a,b) => {
//         let modifier = 1;
//         if(this.currentSortDir === 'desc') modifier = -1;
//         if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
//         if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
//         return 0;
//       });
//     }
//   }
// });

$(document).ready(function() {
  $('#table-dataa').DataTable({
    "processing": true
  });
} );

const api_url = "https://data.covid19.go.id/public/api/prov.json"; 
  
// Defining async function 
async function getapi(url) { 
    const response = await fetch(url);  
    var data = await response.json(); 
    // console.log("Get Data from api: ", data); 
    if (response) { 
        console.log('success');
    } 
    show(data); 
}

// Calling that async function 
getapi(api_url);

// Function to append the data into the datatables 
function show(data) { 
  let tab =  '';
  let i = 0; 
  
  // Loop to access all rows  
  for (let r of data.list_data) { 
    tab += `<tr>  
      <td>${i+1}</td>
      <td>${r.key}</td> 
      <td>${r.jumlah_kasus}</td> 
      <td>${r.jumlah_meninggal}</td>  
      <td>${r.jumlah_sembuh}</td>           
    </tr>`;
    $('#table-dataa').DataTable().row.add($(tab).get(i)).draw();
    i++;
  }  
}


