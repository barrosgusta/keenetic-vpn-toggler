import { KeeneticService } from './services/keenetic-service';
import dotenv from 'dotenv';

dotenv.config();

function areEnvironmentVariablesSet(): boolean {
  return (
    process.env.KEENETIC_HOST !== undefined &&
    process.env.KEENETIC_USER !== undefined &&
    process.env.KEENETIC_PASSWORD !== undefined
  );
}

async function bootstrap() {
  if (!areEnvironmentVariablesSet()) {
    throw new Error('Variáveis de ambiente não estão definidas!');
  }
  const host = process.env.KEENETIC_HOST!;
  const user = process.env.KEENETIC_USER!;
  const password = process.env.KEENETIC_PASSWORD!;

  const previousUpVpnState =
    await KeeneticService.toggleVpnAndReturnPreviousState(host, user, password);

  previousUpVpnState
    ? console.log('VPN foi desligada!')
    : console.log('VPN foi ligada!');
}

bootstrap().catch((err) => {
  console.error('Erro ao acessar o roteador:', err);
  process.exit(1);
});
