import { getProducts } from '../lib/actions.js'

async function testGetProducts() {
  console.log('🧪 === TESTING getProducts() ===')
  
  try {
    // Test sin filtros
    console.log('\n1️⃣ Testing without filters...')
    const allProducts = await getProducts()
    console.log(`Result: ${allProducts.length} products found`)
    
    if (allProducts.length > 0) {
      console.log('Products:')
      allProducts.forEach((p, i) => {
        console.log(`  ${i+1}. ${p.name} (Category: ${p.category}, CategoryRel: ${p.categoryRel?.name})`)
      })
    }
    
    // Test con filtro de categoría
    console.log('\n2️⃣ Testing with category filter...')
    const filteredProducts = await getProducts(null, 'botines')
    console.log(`Result: ${filteredProducts.length} products found for 'botines'`)
    
    // Test con filtro de talla
    console.log('\n3️⃣ Testing with size filter...')
    const sizeFilteredProducts = await getProducts('42', null)
    console.log(`Result: ${sizeFilteredProducts.length} products found for size '42'`)
    
  } catch (error) {
    console.error('❌ Error in test:', error)
  }
  
  console.log('\n✅ === TEST COMPLETED ===')
}

testGetProducts()