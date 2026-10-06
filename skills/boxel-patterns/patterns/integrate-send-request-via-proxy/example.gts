import { Command } from '@cardstack/runtime-common';
import { CardDef, field, contains } from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import SendRequestViaProxyCommand from '@cardstack/boxel-host/tools/send-request-via-proxy';

// 🧩 PATTERN: Arbitrary HTTP through SendRequestViaProxyCommand.
//
// The realm server adds the API key for allowlisted destinations. Cards never
// see API keys.

class WeatherFetchInput extends CardDef {
  @field city = contains(StringField);
}

class WeatherResult extends CardDef {
  @field summary = contains(StringField);
  @field temperatureC = contains(StringField);
}

export default class WeatherFetchCommand extends Command<
  typeof WeatherFetchInput,
  typeof WeatherResult
> {
  static actionVerb = 'Fetch weather';

  async getInputType() {
    return WeatherFetchInput;
  }

  protected async run(input: WeatherFetchInput): Promise<WeatherResult> {
    if (!input.city) throw new Error('city is required');

    const proxy = new SendRequestViaProxyCommand(this.toolContext);

    // 1) Build the URL. When api.weatherapi.com is on the realm server's
    //    allowlist, the server adds its configured API key, so we don't set
    //    one ourselves. Only the query value comes from input; the origin is
    //    fixed.
    const url = `https://api.weatherapi.com/v1/current.json?q=${encodeURIComponent(input.city)}`;

    // 2) Execute the proxied request.
    const result = await proxy.execute({
      url,
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    // 3) result.response is a standard Response.
    if (!result.response.ok) {
      throw new Error(`Weather API failed: ${result.response.status}`);
    }
    const data = await result.response.json();

    return new WeatherResult({
      summary: data.current?.condition?.text ?? 'Unknown',
      temperatureC: String(data.current?.temp_c ?? ''),
    });
  }
}

// === Usage from a component ===========================================
//
//   import { restartableTask } from 'ember-concurrency';
//
//   class CityWeatherWidget extends Component<typeof CityCard> {
//     fetchTask = restartableTask(async () => {
//       const { toolContext } = this.args.context!;
//       const cmd = new WeatherFetchCommand(toolContext);
//       const result = await cmd.execute({ city: this.args.model.name });
//       this.summary = result.summary;
//     });
//   }
