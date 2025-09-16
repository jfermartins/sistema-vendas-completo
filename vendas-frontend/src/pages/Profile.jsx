import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { 
  User, 
  Mail, 
  Camera,
  Loader2,
  Save,
  Key
} from 'lucide-react'
import { userService } from '../services/api'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    old_password: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        old_password: '',
        password: '',
        password_confirmation: ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validação de senha
    if (formData.password && formData.password !== formData.password_confirmation) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password && !formData.old_password) {
      setError('Para alterar a senha, informe a senha atual')
      setLoading(false)
      return
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      }

      // Adicionar dados de senha apenas se estiver alterando
      if (formData.password) {
        updateData.old_password = formData.old_password
        updateData.password = formData.password
        updateData.password_confirmation = formData.password_confirmation
      }

      const response = await userService.updateProfile(updateData)
      updateUser(response.data)
      setSuccess('Perfil atualizado com sucesso!')
      
      // Limpar campos de senha
      setFormData({
        ...formData,
        old_password: '',
        password: '',
        password_confirmation: ''
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB')
      return
    }

    setAvatarLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await userService.updateAvatar(formData)
      updateUser(response.data)
      setSuccess('Avatar atualizado com sucesso!')
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  const getUserInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Card do Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto do Perfil
          </CardTitle>
          <CardDescription>
            Clique na imagem para alterar seu avatar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-xl">
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              
              {avatarLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer transition-all"
              >
                <Camera className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </label>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={avatarLoading}
              />
            </div>
            
            <div>
              <h3 className="font-medium text-lg">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Formatos aceitos: JPG, PNG, GIF (máx. 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Atualize seus dados pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Alterar Senha (opcional)
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="old_password">Senha Atual</Label>
                  <Input
                    id="old_password"
                    type="password"
                    value={formData.old_password}
                    onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                    placeholder="Digite sua senha atual"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nova senha"
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password_confirmation">Confirmar Nova Senha</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      placeholder="Confirme a nova senha"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
