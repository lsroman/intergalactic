import React from 'react';
import { testing } from '@semcore/cli/tools/jest-preset-ui';
const { cleanup } = testing;

import { shared as testsShared } from '@semcore/cli/tools/jest-preset-ui';
const { shouldSupportClassName, shouldSupportRef } = testsShared;
import { snapshot } from '@semcore/cli/tools/jest-preset-ui';
import FormatText from '../src';

describe('FormatText', () => {
  afterEach(cleanup);

  shouldSupportClassName(FormatText);
  shouldSupportRef(FormatText);

  test('Renders correctly', async () => {
    const component = (
      <FormatText>
        <strong>strong</strong>
        <br />
        <em>em element</em>
        <br />
        <s>s element</s>
        <br />
        <abbr>abbr element</abbr>
        <br />
        <a href="#">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae cum cumque dolor dolore
          doloribus ducimus est, et exercitationem in laboriosam maiores molestiae mollitia
          perferendis quisquam repellat saepe soluta, vero vitae.
        </a>
        <br />
        <blockquote>
          Не тот велик, кто не велик, а тот велик, кто велик.
          <cite>- Великий мудрец</cite>
        </blockquote>
        <h1>test</h1>
        <h2>test</h2>
        <h3>test</h3>
        <h4>test</h4>
        <h5>test</h5>
        <h6>test</h6>
        <ul>
          <li>doggo 1</li>
          <li>doggo 2</li>
          <li>doggo 3</li>
        </ul>
        <ol>
          <li>doggo</li>
          <li>doggo</li>
          <li>doggo</li>
        </ol>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus adipisci, atque, autem
          eveniet fugiat incidunt laudantium maiores minus molestias necessitatibus neque obcaecati
          perferendis possimus quibusdam rerum sequi tenetur ut voluptas?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus adipisci, atque, autem
          eveniet fugiat incidunt laudantium maiores minus molestias necessitatibus neque obcaecati
          perferendis possimus quibusdam rerum sequi tenetur ut voluptas?
        </p>
      </FormatText>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });

  test('Lists support sizes', async () => {
    const Inner = () => (
      <>
        <ul>
          <li>doggo</li>
          <li>doggo</li>
          <li>
            doggo
            <ul>
              <li>doggo</li>
              <li>doggo</li>
              <li>doggo</li>
            </ul>
          </li>
        </ul>
        <ol>
          <li>doggo</li>
          <li>doggo</li>
          <li>
            doggo
            <ol>
              <li>doggo</li>
              <li>doggo</li>
              <li>doggo</li>
            </ol>
          </li>
        </ol>
      </>
    );
    const component = (
      <snapshot.ProxyProps style={{ margin: 5 }}>
        <FormatText size={'m'}>
          <Inner />
        </FormatText>
        <FormatText size={'l'}>
          <Inner />
        </FormatText>
        <FormatText size={'xl'}>
          <Inner />
        </FormatText>
      </snapshot.ProxyProps>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });

  test('Paragraphs supports sizes', async () => {
    const Inner = () => (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, molestiae, ut!
          Accusantium aliquam architecto consequuntur debitis delectus, dolorem, eaque
          exercitationem explicabo illum inventore modi nam optio quae, rerum similique voluptatem.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, molestiae, ut!
          Accusantium aliquam architecto consequuntur debitis delectus, dolorem, eaque
          exercitationem explicabo illum inventore modi nam optio quae, rerum similique voluptatem.
        </p>
      </>
    );

    const component = (
      <snapshot.ProxyProps style={{ margin: 5 }}>
        <FormatText size={'m'}>
          <Inner />
        </FormatText>
        <FormatText size={'l'}>
          <Inner />
        </FormatText>
        <FormatText size={'xl'}>
          <Inner />
        </FormatText>
      </snapshot.ProxyProps>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });
});
