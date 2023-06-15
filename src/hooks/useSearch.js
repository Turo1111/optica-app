
export const useSearch = (search, tags, list) => {

    if(search !== '' ){

        let result = []

        list.map(item=>{
          tags.map(tag=>{
            if(tag instanceof Object){
              const key = Object.keys(tag)[0]
              tag[key].map(i=>{
                item[key][i]?.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1 && result.push(item)
              })
            } else{
              item[tag]?.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1 && result.push(item)
            }
          })
        })
    
        const busqueda = result.reduce((acc, item) => {
          acc[item._id] = ++acc[item._id] || 0;
          return acc;
        }, {});

        const duplicados = result.filter( (item) => {
          return busqueda[item._id];
        });
        result = result.filter( (item) => {
          return !busqueda[item._id];
        });

        duplicados.length !== 0 && result.push(duplicados[0])

        return result
        
    } else {
        return list
    }

}