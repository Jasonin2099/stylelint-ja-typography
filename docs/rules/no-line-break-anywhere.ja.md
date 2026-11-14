# ja-typography/no-line-break-anywhere

[English](./no-line-break-anywhere.md)

`line-break: anywhere` を禁止します。

```css
p { line-break: anywhere; }
/**             ↑
 * 禁則処理が効かなくなる */
```

## 理由

日本語の改行には、行頭に置けない文字（閉じ括弧、。、、小書きの仮名、ー など）や行末に置けない文字（始め括弧）の決まりがあります。JLREQ では「行頭禁則」「行末禁則」として定められています（[JLREQ 行頭禁則](https://www.w3.org/TR/jlreq/#term.line-start-prohibition-rule)）。CSS では `line-break: strict | normal | loose` でこの規則の強さを選びます。

`anywhere` はこれと異なり、「句読点も含めたすべての文字の前後で改行でき、改行の禁止をすべて無視する」値です（[CSS Text 3 line-break](https://www.w3.org/TR/css-text-3/#valdef-line-break-anywhere)）。日本語に使うと、行頭に 。や 」 が来ます。

多くの場合、長い URL やコードのはみ出しを防ぐために使われています。それなら `overflow-wrap: anywhere` で足ります。ほかに収める方法がないときだけ改行するので、禁則処理は残ります。

| やりたいこと | 使うもの |
| --- | --- |
| 長い URL や ID のはみ出しを防ぐ | `overflow-wrap: anywhere` |
| 幅の狭い段組み（新聞のような組み） | `line-break: loose` |
| 書籍のような厳格な組み | `line-break: strict` |

仕様には、CJK が主体の表示で `anywhere` が望まれる場合もあると書かれています。意図して使う箇所は `ignoreSelectors` で除外してください。

## オプション

### `true`

問題とみなす例：

```css
p { line-break: anywhere; }
```

```css
p { -webkit-line-break: anywhere; }
```

問題としない例：

```css
p { line-break: strict; }
```

```css
p { overflow-wrap: anywhere; }
```

## 追加オプション

### `ignoreSelectors: ["string", "/regex/"]`

一致するセレクターを無視します。

## 自動修正

対象外です。置き換え先が場面によって異なるためです（上の表）。
