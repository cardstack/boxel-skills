import { CardDef, field, contains } from 'https://cardstack.com/base/card-api';

// Surface-aware FieldDefs (assume already authored per surface-field-kit).
import { SurfaceTextField     } from './surface-text-field';
import { SurfaceEmailField    } from './surface-email-field';
import { SurfaceSalaryField   } from './surface-salary-field';
import { SurfaceBioField      } from './surface-bio-field';
import { SurfaceActiveField   } from './surface-active-field';
import { SurfacePillField     } from './surface-pill-field';     // owner — enum chip
import { SurfaceChipsField    } from './surface-chips-field';    // tags — multi-select
import { SurfaceBudgetField   } from './surface-budget-field';   // number + unit
import { SurfaceLaunchField   } from './surface-launch-field';   // date
import { SurfaceAssetField    } from './surface-asset-field';    // image enum
import { SurfaceStarsField    } from './surface-stars-field';    // 0..5 rating
import { SurfaceSliderField   } from './surface-slider-field';   // 0..100 slider
import { SurfaceCheckboxField } from './surface-checkbox-field'; // boolean
import { SurfaceActionsField  } from './surface-actions-field';  // command picker

// 🧩 PATTERN: Surface form card.
//
// One CardDef hosts the full set of typed surface fields. The default
// isolated/edit template renders them as a form; a sibling Grid card
// can render the SAME fields as a sheet.

export class SurfaceFormCard extends CardDef {
  static displayName = 'Surface Form Card';

  // employee onboarding (form-style)
  @field firstName  = contains(SurfaceTextField);
  @field lastName   = contains(SurfaceTextField);
  @field email      = contains(SurfaceEmailField);
  @field phone      = contains(SurfaceTextField);
  @field salary     = contains(SurfaceSalaryField);
  @field bio        = contains(SurfaceBioField);
  @field active     = contains(SurfaceActiveField);

  // spreadsheet-flavored (12-type demonstration)
  @field owner      = contains(SurfacePillField);
  @field tags       = contains(SurfaceChipsField);
  @field budget     = contains(SurfaceBudgetField);
  @field launch     = contains(SurfaceLaunchField);
  @field asset      = contains(SurfaceAssetField);
  @field confidence = contains(SurfaceStarsField);
  @field readiness  = contains(SurfaceSliderField);
  @field briefed    = contains(SurfaceCheckboxField);
  @field actions    = contains(SurfaceActionsField);

  // No custom isolated/edit — use Boxel's default template (or the
  // surfacified one from surface-default-template). The fields handle
  // their own surface presentation.
}
