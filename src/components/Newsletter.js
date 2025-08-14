import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('¡Gracias por suscribirte!');
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Suscríbete para más ofertas
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Recibe las mejores ofertas, nuevos productos y consejos de ciclismo directamente en tu email
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email aquí..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 outline-none"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Suscribirse
              </button>
            </div>
          </form>
          
          <p className="text-sm opacity-75 mt-4">
            No spam. Puedes cancelar tu suscripción en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
