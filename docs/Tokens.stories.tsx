import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars, tokenMeta, tokenValues, type TokenPath } from '../src/tokens/tokens.generated';
import { StatusLegend, TokenFlags, pageStyle } from './foundations';

function TokenTable() {
  const rows = Object.entries(cssVars) as [TokenPath, string][];
  const values = tokenValues as Record<string, string>;
  if (rows.length === 0) {
    return (
      <p>
        No tokens defined yet. Add values to <code>tokens/*.json</code> and run <code>npm run tokens</code>.
      </p>
    );
  }
  return (
    <div style={pageStyle}>
    <StatusLegend />
    <table>
      <thead>
        <tr>
          <th align="left">Token</th>
          <th align="left">CSS variable</th>
          <th align="left">Value</th>
          <th align="left">Layer</th>
          <th align="left">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([path, ref]) => (
          <tr key={path} data-token={path}>
            <td>{path}</td>
            <td>
              <code>{ref}</code>
            </td>
            <td>{values[path]}</td>
            <td>{tokenMeta[path].layer}</td>
            <td>
              <TokenFlags path={path} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

const meta = { title: 'Foundations/Tokens', component: TokenTable } satisfies Meta<typeof TokenTable>;
export default meta;
export const AllTokens: StoryObj<typeof meta> = {};
