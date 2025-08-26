import { useEffect, useState } from 'react';

import { apiTwsSoftware } from '@utils/api';
import { useCookies } from 'react-cookie'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

const useVerifyAuth = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado para refletir a autenticação

  const [cookies, setCookie, removeCookie] = useCookies(['userDataArtigoLoginWhatsApp'])
  const userDataArtigoLoginWhatsApp = cookies.userDataArtigoLoginWhatsApp || ''

  const router = useRouter()

  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {

    // Se o cookie não existe ou não contém o token, considera como não autenticado
    if (!userDataArtigoLoginWhatsApp || !userDataArtigoLoginWhatsApp.token) {
      
      setIsAuthenticated(false);

      return;
    }

    try {

      // Verificar o token na API
      const response = await apiTwsSoftware.post(
        '/verify-token',
        {},
        {
          headers: {
            Authorization: `Bearer ${userDataArtigoLoginWhatsApp.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('response.data', response.data)

      if (response.data.error) {

        logout(); // Logout automático se token inválido
        
        return;
      }

      // Se o token for válido, define como autenticado
      setIsAuthenticated(true);

    } catch (error) {

      console.log('/verify-token', error.response?.data);

      logout(); // Logout automático em erro
    }
  };

  const logout = () => {

    removeCookie('userDataArtigoLoginWhatsApp', { path: '/' });
    setIsAuthenticated(false);

    /*router.push('/en/buscar-imoveis').then(() => {
      window.location.reload()
    })*/

    router.push('/en/buscar-imoveis');
  };

  return [isAuthenticated, logout];
};

export default useVerifyAuth;
