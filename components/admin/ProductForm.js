import Link from 'next/link'

export default function ProductForm({ action, product = null }) {
  const isEditing = !!product

  return (
    <form action={action} className="p-6 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del producto
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          placeholder="Ej: Botas de cuero elegantes"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          placeholder="Describe las características del producto..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio (€)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            min="0"
            defaultValue={product?.price || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            placeholder="99.99"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category || 'botas'}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          >
            <option value="botas">Botas</option>
            <option value="cinturones">Cinturones</option>
            <option value="ropa">Ropa</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
            Talla
          </label>
          <select
            id="size"
            name="size"
            required
            defaultValue={product?.size || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          >
            <option value="">Seleccionar talla</option>
            <option value="35">35</option>
            <option value="36">36</option>
            <option value="37">37</option>
            <option value="38">38</option>
            <option value="39">39</option>
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
            <option value="43">43</option>
            <option value="44">44</option>
            <option value="45">45</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="Único">Único</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL de la imagen (opcional)
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          defaultValue={product?.imageUrl || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        <p className="mt-2 text-sm text-gray-500">
          Proporciona una URL válida de imagen. Si se deja vacío, se mostrará un placeholder.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Link
          href="/admin"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  )
}